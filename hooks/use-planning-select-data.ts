import { useEffect, useState } from "react";
import type {
  OperationalFunction,
  Vehicle,
} from "@/types/operational-planning";
import type { User } from "@/types/auth";

export function usePlanningSelectData() {
  const [users, setUsers] = useState<User[]>([]);
  const [functions, setFunctions] = useState<OperationalFunction[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, functionsRes, vehiclesRes] = await Promise.all([
          fetch("/api/users"),
          fetch("/api/functions"),
          fetch("/api/vehicles"),
        ]);

        const usersData = await usersRes.json();
        const functionsData = await functionsRes.json();
        const vehiclesData = await vehiclesRes.json();

        setUsers(usersData.map((u: User) => ({ ...u, createdAt: new Date(u.createdAt) })));
        setFunctions(functionsData.map((f: OperationalFunction) => ({ ...f, createdAt: new Date(f.createdAt), updatedAt: new Date(f.updatedAt) })));
        setVehicles(vehiclesData.map((v: Vehicle) => ({ ...v, createdAt: new Date(v.createdAt), updatedAt: new Date(v.updatedAt) })));
      } catch (error) {
        console.error("Failed to fetch select data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return {
    users,
    functions,
    vehicles,
    isLoading,
  };
}
