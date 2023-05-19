import { WithPageAuthRequired } from "@auth0/nextjs-auth0";

export default function PostId() {
  return (
    <div>
      <h1>PostId</h1>
    </div>
  );
}

export const getServerSideProps = withPageAuthRequired(() => {
  return {
    props: {},
  };
});
