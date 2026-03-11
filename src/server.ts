import mongoose from "mongoose"
import app from "./app"
import { envVar } from "./app/config/env"
import { logger } from "./app/shared/looger"
import { connectRedis } from "./app/config/redis.config"
import { seedSuperAdmin } from "./app/utils/seed.SuperAdmin"
import { socketHelper } from "./app/helpers/socketHelper"
import { Server } from "socket.io"


let server: any

// servers connected
const startServer = async () => {

   try {
      await mongoose.connect(envVar.DB_URL)
      logger.info("Server Connected Sucessfully")
      const port = typeof envVar.PORT === 'number' ? envVar.PORT : Number(envVar.PORT);
      //USE port and IP address
      server = app.listen(port, () => {
         logger.info("🔥🔥Server is Running")
      })

      // 🔥 Initialize Socket.io
      //socket
      const io = new Server(server, {
         pingTimeout: 60000,
         cors: {
            origin: '*',
         },
      });
      socketHelper.socket(io);
      //@ts-ignore
      global.io = io;
   } catch (error) {
      console.log(error);
   }
}

(async () => {
   await connectRedis()
   await startServer()
   await seedSuperAdmin()
}
)()


// unhandle rejection error
process.on("unhandledRejection", (err) => {
   console.log("Unhandled Rejection detected... Server shutting down.", err)
   if (server) {
      server.close(() => {
         process.exit(1)
      })
   }
   process.exit(1)
})
// uncaught  Exception error
process.on("uncaughtException", (err) => {
   console.log("uncaught Exception  detected... Server shutting down.", err)
   if (server) {
      server.close(() => {
         process.exit(1)
      })
   }
   process.exit(1)
})
// Sigtram  Exception error
process.on("SIGTERM", () => {
   console.log("Sigter sigmal   recieved... Server shutting down.")
   if (server) {
      server.close(() => {
         process.exit(1)
      })
   }
   process.exit(1)
})

// Sigtram  Exception error
process.on("SIGINT", () => {
   console.log("SIGINT signal   recieved... Server shutting down.")
   if (server) {
      server.close(() => {
         process.exit(1)
      })
   }
   process.exit(1)
})