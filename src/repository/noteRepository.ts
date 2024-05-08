import notePostgresRepo from "./notePostgresRepo";
import noteInMemoryRepo from "./noteInMemoryRepo";

export default process.env.NODE_ENV === "test" ? noteInMemoryRepo : notePostgresRepo;