import { useGLTF } from "@react-three/drei";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { KTX2Loader } from "three/examples/jsm/loaders/KTX2Loader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import * as THREE from "three";

export function configureThreeLoaders(renderer?: THREE.WebGLRenderer) {
  if (typeof window === "undefined") return;

  // DRACO (use CDN decoders; you can self-host later under /draco/)
  const draco = new DRACOLoader();
  draco.setDecoderPath(
    "https://unpkg.com/three@0.176.0/examples/jsm/libs/draco/",
  );
  useGLTF.setDRACOLoader(draco);

  // Meshopt
  useGLTF.setMeshoptDecoder(MeshoptDecoder);

  // KTX2 / BasisU (GPU compressed textures)
  const r =
    renderer || new THREE.WebGLRenderer({ powerPreference: "low-power" });
  const ktx2 = new KTX2Loader()
    .setTranscoderPath(
      "https://unpkg.com/three@0.176.0/examples/jsm/libs/basis/",
    )
    .detectSupport(r);
  useGLTF.setKTX2Loader(ktx2);
}
