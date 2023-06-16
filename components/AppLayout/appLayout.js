import { useUser } from "@auth0/nextjs-auth0/client";
import { useContext, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoins } from "@fortawesome/free-solid-svg-icons";
import { Logo } from "../Logo";
import PostsContext from "../../context/postsContext";

export const AppLayout = ({
  children,
  availableTokens,
  posts: postsFromSSR,
  postId,
  postCreated,
}) => {
  const { user } = useUser();

  const { setPostsFromSSR, posts, getPosts, noMorePosts } =
    useContext(PostsContext);

  useEffect(() => {
    setPostsFromSSR(postsFromSSR);
    if (postId) {
      const exists = postsFromSSR.find((post) => post._id === postId);
      if (!exists) {
        getPosts({ getNewerPosts: true, lastPostDate: postCreated });
      }
    }
  }, [postsFromSSR, setPostsFromSSR, postId, postCreated, getPosts]);

  return (
    <div className="grid grid-cols-[300px_1fr] h-screen max-h-screen">
      <div className="bg-[#000839] flex flex-col text-white overflow-hidden">
        <div className="px-2">
          <Logo />
          <Link href="/post/new" className="btn">
            New post
          </Link>
          <Link href="/token-topup" className="my-4 text-center block">
            <FontAwesomeIcon icon={faCoins} className="text-yellow-500" />
            <span className="pl-1 hover:text-violet-300">
              {availableTokens} available tokens
            </span>
          </Link>
        </div>
        <div className="flex-1 bg-gradient-to-b from-[#000839] to-[#572be5] overflow-auto px-4">
          {posts.map((post) => (
            <Link
              key={post._id}
              href={`/post/${post._id}`}
              className={`border border-white/0 block text-ellipsis overflow-hidden whitespace-nowrap my-1 px-2 py-1 bg-white/10 cursor-pointer rounded-sm hover:text-violet-300 ${
                postId === post._id ? "bg-white/20 border-white" : ""
              }`}
            >
              {post.topic}
            </Link>
          ))}
          {!noMorePosts && (
            <div
              onClick={() => {
                getPosts({ lastPostDate: posts[posts.length - 1].created });
              }}
              className="hover:underline text-sm text-slate-400 text-center cursor-pointer mt-4"
            >
              Load more posts
            </div>
          )}
        </div>
        <div className="bg-[#572be5] flex items-center gap-2 border-t border-t-[#000839]/30 h-20 px-2">
          {user ? (
            <>
              <div className="min-w-[50px]">
                <Image
                  src={user.picture}
                  alt={user.name}
                  height={50}
                  width={50}
                  className="rounded-full"
                />
              </div>
              <div className="flex-1">
                <div className="font-bold">{user.email}</div>
                <Link href="/api/auth/logout" className="text-sm">
                  Logout
                </Link>
              </div>
            </>
          ) : (
            <Link href="/api/auth/login">Login</Link>
          )}
        </div>
      </div>
      <div className="overflow-scroll mb-10">{children}</div>
    </div>
  );
};
