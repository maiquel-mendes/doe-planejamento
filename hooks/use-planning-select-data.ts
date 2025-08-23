import { useEffect, useState } from "react";
import type {
  Location,
  OperationalFunction,
  Vehicle,
} from "@/types/operational-planning";
import type { User } from "@/types/auth";
import { api } from "@/lib/api";

export function usePlanningSelectData() {
  const [users, setUsers] = useState<User[]>([]);
  const [functions, setFunctions] = useState<OperationalFunction[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [locations, setLocations] = useState<Location[]>([]); // Added locations state
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, functionsRes, vehiclesRes, locationsRes] = await Promise.all([
          api("/api/users"),
          api("/api/functions"),
          api("/api/vehicles"),
          api("/api/locations"), // Added locations API call
        ]);

        if (!usersRes.ok || !functionsRes.ok || !vehiclesRes.ok || !locationsRes.ok) {
          throw new Error('One or more network responses were not ok');
        }

        const usersData = await usersRes.json();
        const functionsData = await functionsRes.json();
        const vehiclesData = await vehiclesRes.json();
        const locationsData = await locationsRes.json(); // Process locations data

        setUsers(usersData.map((u: User) => ({ ...u, createdAt: new Date(u.createdAt) })));
        setFunctions(functionsData.map((f: OperationalFunction) => ({ ...f, createdAt: new Date(f.createdAt), updatedAt: new Date(f.updatedAt) })));
        setVehicles(vehiclesData.map((v: Vehicle) => ({ ...v, createdAt: new Date(v.createdAt), updatedAt: new Date(v.updatedAt) })));
        setLocations(locationsData.map((l: Location) => ({ ...l, createdAt: new Date(l.createdAt), updatedAt: new Date(l.updatedAt) }))); // Set locations state
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
    locations, // Included locations in the return object
    isLoading,
  };
}