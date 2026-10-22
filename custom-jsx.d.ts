import type { ThreeElement } from "@react-three/fiber";
import type { BentPlaneGeometry, MeshSineMaterial } from "@/components/main/WorkExperience/util";

declare module "@react-three/fiber" {
  interface ThreeElements {
    bentPlaneGeometry: ThreeElement<typeof BentPlaneGeometry>;
    meshSineMaterial: ThreeElement<typeof MeshSineMaterial>;
  }
}
