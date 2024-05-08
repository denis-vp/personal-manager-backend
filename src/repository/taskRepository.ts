import taskPostgresRepo from "./taskPostgresRepo";
import taskInMemoryRepo from "./taskInMemoryRepo";

export default process.env.NODE_ENV === "test" ? taskInMemoryRepo : taskPostgresRepo;