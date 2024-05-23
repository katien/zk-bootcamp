"use client";
import { useState, useEffect } from "react";
import {
  CompilationArtifacts,
  initialize,
  Proof,
  SetupKeypair,
  ZoKratesProvider,
} from "zokrates-js";

export default function Page() {
  const [d, setD] = useState("");
  const [witness, setWitness] = useState<Uint8Array>();
  const [output, setOutput] = useState("");
  const [proof, setProof] = useState<Proof>();
  const [verifier, setVerifier] = useState("");
  const [isVerified, setIsVerified] = useState<string>("");

  const [zokratesProvider, setZokratesProvider] = useState<ZoKratesProvider>();
  const [artifacts, setArtifacts] = useState<CompilationArtifacts>();
  const [keypair, setKeypair] = useState<SetupKeypair>();

  useEffect(() => {
    initialize().then((provider: ZoKratesProvider) => {
      setZokratesProvider(provider);

      const source = `
        import "hashes/sha256/512bitPacked" as sha256packed;
        def main(private field a, private field b, private field c, private field d) {
            field[2] h = sha256packed([a, b, c, d]);
            assert(h[0] == 263561599766550617289250058199814760685);
            assert(h[1] == 65303172752238645975888084098459749904);
            return;
        }
      `;

      const compiledArtifacts: CompilationArtifacts = provider.compile(source);
      setArtifacts(compiledArtifacts);

      const generatedKeypair: SetupKeypair = provider.setup(
        compiledArtifacts.program,
      );
      setKeypair(generatedKeypair);
    });
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (zokratesProvider && artifacts && keypair) {
      try {
        const { witness, output } = zokratesProvider.computeWitness(artifacts, [
          "0",
          "0",
          "0",
          d,
        ]);
        const proof: Proof = zokratesProvider.generateProof(
          artifacts.program,
          witness,
          keypair.pk,
        );
        const verifier = zokratesProvider.exportSolidityVerifier(keypair.vk);
        const isVerified = zokratesProvider.verify(keypair.vk, proof);

        setWitness(witness);
        setOutput(output);
        setProof(proof);
        setVerifier(verifier);
        setIsVerified(isVerified ? "Verified" : "Not Verified");
      } catch (error) {
        console.error(error);
        setIsVerified("Not Verified");
      }
    }
  };

  if (!zokratesProvider) return <p>Compiling circuit...</p>;

  return (
    <form onSubmit={handleSubmit}>
      <h1 className="mt-20 mb-6 text-3xl font-bold leading-tight tracking-tight">
        Zokrates Hash Preimage Circuit
      </h1>
      <div className="space-y-12">
        <div className="border-b border-white/10 pb-12">
          <p className="mt-1 text-sm leading-6 text-gray-400">
            Enter the preimage to the hash:
            0xc6481e22c5ff4164af680b8cfaa5e8ed3120eeff89c4f307c4a6faaae059ce10
          </p>
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label
                htmlFor="input"
                className="block text-sm font-medium leading-6 text-white"
              >
                Input
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="input"
                  id="input"
                  value={d}
                  onChange={(e) => setD(e.target.value)}
                  className="block w-full rounded-md bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  placeholder="Enter value for d"
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
            htmlFor="witness"
            className="block text-sm font-medium leading-6 text-white"
          >
            Witness
          </label>
          <textarea
            id="witness"
            name="witness"
            rows={3}
            value={witness?.toString()}
            readOnly
            className="block w-full rounded-md bg-white/5 py-1.5 text-white sm:text-sm"
          />
        </div>
        <div className="mt-2">
          <label
            htmlFor="output"
            className="block text-sm font-medium leading-6 text-white"
          >
            Output
          </label>
          <textarea
            id="output"
            name="output"
            rows={3}
            value={output}
            readOnly
            className="block w-full rounded-md bg-white/5 py-1.5 text-white sm:text-sm"
          />
        </div>
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
            value={JSON.stringify(proof)}
            readOnly
            className="block w-full rounded-md bg-white/5 py-1.5 text-white sm:text-sm"
          />
        </div>
        <div className="mt-2">
          <label
            htmlFor="verifier"
            className="block text-sm font-medium leading-6 text-white"
          >
            Verifier
          </label>
          <textarea
            id="verifier"
            name="verifier"
            rows={3}
            value={verifier}
            readOnly
            className="block w-full rounded-md bg-white/5 py-1.5 text-white sm:text-sm"
          />
        </div>
        <div className="mt-2">
          <label
            htmlFor="isVerified"
            className="block text-sm font-medium leading-6 text-white"
          >
            Verification Status
          </label>
          <textarea
            id="isVerified"
            name="isVerified"
            rows={1}
            value={isVerified}
            readOnly
            className="block w-full rounded-md bg-white/5 py-1.5 text-white sm:text-sm"
          />
        </div>
      </div>
    </form>
  );
}
