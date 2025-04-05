import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { User } from "@/models/user";
import { RaspberryPi } from "@/models/raspberryPi";

import connectToDatabase from "@/lib/mongodb";

const registeredDevices = new Set();
const waitingDevices = new Map(); // Map to track waiting devices (device_id: resolve function)

// Function to wait for up to 30 seconds
const waitForUserToRegister = (device_id) => {
  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      waitingDevices.delete(device_id); // Remove from waiting list after timeout
      registeredDevices.delete(device_id); // Cleanup
      resolve({
        success: false,
        message: "User did not register the device in time",
      });
    }, 30000); // 30 seconds

    // Store resolve function so user can manually resolve it later
    waitingDevices.set(device_id, (result) => {
      clearTimeout(timeout); // Stop timeout if user registers in time
      waitingDevices.delete(device_id);
      resolve(result);
    });
  });
};

export async function POST(req) {

  try {
    const session = await getServerSession(authOptions);
    const { device_id, mode, name } = await req.json();
    console.log("mode: ", mode);
    console.log("session: ", session);

    if (!device_id) {
      console.log("No device_id");
      return NextResponse.json({ error: "Missing device_id" }, { status: 400 });
    }

    console.log(`Received request: ${mode}, Device ID: ${device_id}`);

    // Step 1: Device registers itself and waits for user
    if (mode === "device") {
      if (registeredDevices.has(device_id)) {
        return NextResponse.json(
          { message: "Device already registered" },
          { status: 409 }
        );
      }

      registeredDevices.add(device_id);
      console.log(`Device registered: ${device_id}, waiting for user...`);

      // Wait for user to register or timeout
      const result = await waitForUserToRegister(device_id);
      return NextResponse.json(result, { status: result.success ? 200 : 408 }); // 408 for timeout
    }

    await connectToDatabase();
 
    // Step 2: User registers the device
    if (mode === "user") {

      console.log("available devices: ", registeredDevices); // Set(0){}
      if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      //changed the code
      if (!registeredDevices.has(device_id)) {
        return NextResponse.json(
          { error: "Device not found or timeout expired" }, // error here!!!!!!!!!!!!!!!
          { status: 404 }
        );
      }

      const userId = session.user.id;
      registeredDevices.delete(device_id); // Remove from temporary storage

      // Save device-user mapping in MongoDB
      const serialId = device_id;
      //  1. get the user object
      const user = await User.findOne({ email: session.user.email });

      if (!user) {
        throw new Error("User not found");
      }

      // 2. create a new Raspberry Pi
      await connectToDatabase();
      // 2a. check if device already exists
      const device = await RaspberryPi.findOne({ serialId: serialId });
      if (device) {
        throw new Error("Device already registered");
      } else {
        // not registered yet
        const newRaspberryPi = new RaspberryPi({
          userId: user,
          name: name,
          serialId: serialId,
        });
        // 3. save
        await newRaspberryPi.save();
      }
      // Notify waiting device (if still waiting)
      if (waitingDevices.has(device_id)) {
        waitingDevices.get(device_id)({
          success: true,
          message: "Device linked to user",
        });
      }
      console.log(`Device ${device_id} linked to user ${userId}`);

      return NextResponse.json(
        { message: "Device linked successfully" },
        { status: 200 }
      );
    }

    return NextResponse.json({ error: "Invalid mode" }, { status: 400 });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Optional: Allow GET to view registered devices (for testing)
export async function GET() {
  return NextResponse.json({
    registeredDevices: Array.from(registeredDevices),
  });
}
