import { IDKitWidget, ISuccessResult, CredentialType } from "@worldcoin/idkit";
import {FunctionComponent} from "react";

const Worldcoin: FunctionComponent = () => {

  const handleProof = (result: ISuccessResult) => {
    console.log(result)
    return new Promise<void>((resolve, reject) => {
      const fetchAddress = async () => {
          try {
              const response = await fetch('/api/worldcoin/', {
                method:'POST',
                body:JSON.stringify(result),
                headers: {
                  'Content-Type' : 'application/json'
                },
              });
              if (response.status === 200) {
                  resolve()
              }
              reject()
          } catch (e) {
              console.error(e);
              reject()
          }
      };
      fetchAddress();
		});
	};

  const onSuccess = (result: ISuccessResult) => {
		console.log(result);
	};

  const urlParams = new URLSearchParams(window.location.search);
	const credential_types = (urlParams.get("credential_types")?.split(",") as CredentialType[]) ?? [
		CredentialType.Orb,
		CredentialType.Phone,
	];

  return (
    <>
      <p>Get free credit, identify once with worldcoin</p>
      <div
			className="App"
			style={{
				minHeight: "100vh",
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
			}}>
	   <IDKitWidget
		   app_id="app_13ab310215a3903f8d78039d17ce46a6" // obtain this from developer.worldcoin.org
		   action="free-credit"
       signal="random_signal"
       credential_types={credential_types}
		   onSuccess={onSuccess} // pass the proof to the API or your smart contract
       handleVerify={handleProof}
	   >
     {({ open } : { open : any }) => <button onClick={open}>Login with worldcoin</button>}
     </IDKitWidget>
     </div>
     </>

  )
}

export default Worldcoin
