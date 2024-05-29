"use client";
import { useState, useEffect } from "react";
import circuit from "../../noir_circuit/target/noir_circuit.json";
import { BarretenbergBackend } from "@noir-lang/backend_barretenberg";
import { Noir } from "@noir-lang/noir_js";

export default function Page() {
  const [input, setInput] = useState("");
  const [proof, setProof] = useState<>("");

  useEffect(() => {
    (async function setup() {
      await Promise.all([
        import("@noir-lang/noirc_abi").then((module) =>
          module.default(
            new URL(
              "@noir-lang/noirc_abi/web/noirc_abi_wasm_bg.wasm",
              import.meta.url,
            ).toString(),
          ),
        ),
        import("@noir-lang/acvm_js").then((module) =>
          module.default(
            new URL(
              "@noir-lang/acvm_js/web/acvm_js_bg.wasm",
              import.meta.url,
            ).toString(),
          ),
        ),
      ]);
    })();
  }, []);

  const handleSubmit = async (e: any) => {
    try {
      e.preventDefault();
      const backend = new BarretenbergBackend(circuit);
      const noir = new Noir(circuit, backend);

      let finalProof = await noir.generateFinalProof({ x: input });
      let hexProof =
        "0x" +
        Array.from(finalProof.proof, (byte) =>
          byte.toString(16).padStart(2, "0"),
        ).join("");

      setProof(hexProof);
    } catch (err) {
      alert(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1 className="mt-20 mb-6 text-3xl font-bold leading-tight tracking-tight">
        Aztec
      </h1>
      <div className="space-y-12">
        <div className="border-b border-white/10 pb-12">
          <a
            className="text-indigo-500"
            target="_blank"
            href={
              "https://sepolia.etherscan.io/address/0xbd894dd2a88d0d2f7fa404b9cfd225b7ecb2749e#readContract"
            }
          >
            Click here to verify your proof on a smart contract
          </a>
          <p className="mt-1 text-sm leading-6 text-gray-400">
            Call the verify function with the hex proof as your _proof and an
            empty array for _publicInputs
          </p>
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label
                htmlFor="input"
                className="block text-sm font-medium leading-6 text-white"
              >
                Input
              </label>
              <p className=" text-sm  text-gray-400">
                Which number multiplied by itself is equal to 25?
              </p>
              <div className="mt-2">
                <input
                  type="text"
                  name="input"
                  id="input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="block w-full rounded-md bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  placeholder="5"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
          type="button"
          className="text-sm font-semibold leading-6 text-white"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
        >
          Save
        </button>
      </div>

      <div className="mt-10">
        <h2 className="text-base font-semibold leading-7 text-white">
          Outputs
        </h2>

        <div className="mt-2">
          <label
            htmlFor="proof"
            className="block text-sm font-medium leading-6 text-white"
          >
            Proof
          </label>
          <textarea
            id="proof"
            name="proof"
            rows={3}
            value={proof}
            readOnly
            className="block w-full rounded-md bg-white/5 py-1.5 text-white sm:text-sm"
          />
        </div>
        <div className="mt-2">
          <label
            htmlFor="verifier"
            className="block text-sm font-medium leading-6 text-white"
          >
            Verifier Address
          </label>
          <textarea
            id="verifier"
            name="verifier"
            rows={3}
            value={"0xbd894DD2a88d0D2F7fA404b9cFd225b7ecb2749E"}
            readOnly
            className="block w-full rounded-md bg-white/5 py-1.5 text-white sm:text-sm"
          />
        </div>
      </div>
    </form>
  );
}
