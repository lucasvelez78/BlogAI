import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { AppLayout } from "../components/AppLayout";
import { getAppProps } from "../utils/getAppProps";

export default function TokenTopup() {
  const handleClick = async () => {
    const result = await fetch("/api/addTokens", {
      method: "POST",
    });
    const json = await result.json();
    console.log("Result: ", json);
    window.location.href = json.session.url;
  };

  return (
    <div className="h-full overflow-hidden">
      <div className="w-full h-full flex flex-col overflow-auto">
        <div className="m-auto w-full max-w-screen-sm bg-slate-100 p-4 rounded-md shadow-xl border border-slate-200 shadow-slate-200 text-center">
          <h1 className="text-slate-600">Buy your tokens here</h1>
          <button className="btn" onClick={handleClick}>
            Add tokens
          </button>
        </div>
      </div>
    </div>
  );
}

TokenTopup.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
};

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(context) {
    const props = await getAppProps(context);
    return {
      props,
    };
  },
});
