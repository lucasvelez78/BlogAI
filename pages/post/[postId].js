import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
import { useState, useContext } from "react";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHashtag } from "@fortawesome/free-solid-svg-icons";
import { ObjectId } from "mongodb";
import { AppLayout } from "../../components/AppLayout";
import clientPromise from "../../lib/mongodb";
import { getAppProps } from "../../utils/getAppProps";
import PostsContext from "../../context/postsContext";

export default function PostId(props) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const router = useRouter();
  const { deletePost } = useContext(PostsContext);

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(`/api/deletePost`, {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ postId: props.id }),
      });
      const json = await response.json();
      if (json.success) {
        deletePost(props.id);
        router.replace("/post/new");
      }
    } catch (error) {}
  };

  return (
    <div className="overfolw-auto h-full">
      <div className="max-w-screen-sm mx-auto">
        <div className="text-sm font-bold mt-6 p-2 bg-stone-200 rounded-sm">
          SEO title and meta description
        </div>
        <div className="p-4 my-2 border border-stone-200 rounded-md">
          <div className="text-violet-900 text-2xl font-bold">
            {props.title}
          </div>
          <div className="mt-2 ">{props.metaDescription}</div>
        </div>
        <div className="text-sm font-bold mt-6 p-2 bg-stone-200 rounded-sm mb-2">
          Keywords
        </div>
        <div className="flex flex-wrap">
          {props.keywords.split(",").map((keyword, index) => (
            <div
              key={index}
              className="p-2 rounded-full bg-slate-800 text-white mr-2"
            >
              <FontAwesomeIcon icon={faHashtag} /> {keyword}
            </div>
          ))}
        </div>
        <div className="text-sm font-bold mt-6 p-2 bg-stone-200 rounded-sm">
          Blog Post
        </div>
        <div dangerouslySetInnerHTML={{ __html: props.postContent || "" }} />
        {showDeleteConfirm ? (
          <div>
            <p className="p-2 text-center bg-[#ff96be]">
              Are you sure you want to delete this post? This action is
              irreversible
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                className="btn bg-stone-500 bg-stone-700"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="btn bg-[#FB2576] hover:bg-[#ce125a]"
                onClick={handleDeleteConfirm}
              >
                Confirm delete
              </button>
            </div>
          </div>
        ) : (
          <div className="my-6 ">
            <button
              className="btn bg-[#FB2576] hover:bg-[#ce125a]"
              onClick={() => setShowDeleteConfirm(true)}
            >
              Delete post
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

PostId.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
};

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(context) {
    const props = await getAppProps(context);
    const userSession = await getSession(context.req, context.res);
    const client = await clientPromise;
    const db = client.db("blogAI");
    const user = await db.collection("users").findOne({
      auth0Id: userSession.user.sub,
    });
    const post = await db.collection("posts").findOne({
      _id: new ObjectId(context.params.postId),
      userId: user._id,
    });
    if (!post) {
      return {
        redirect: {
          destination: "/post/new",
          permanent: false,
        },
      };
    }

    return {
      props: {
        id: context.params.postId,
        postContent: post.postContent,
        title: post.title,
        metaDescription: post.metaDescription,
        topic: post.topic,
        keywords: post.keywords,
        postCreated: post.created.toString(),
        ...props,
      },
    };
  },
});
