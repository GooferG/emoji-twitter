import { type NextPage } from "next";
import { ClerkLoading, SignIn, useUser } from "@clerk/nextjs";
import { RouterOutputs, api } from "~/utils/api";
import Head from "next/head";
import { SignInButton, SignOutButton } from "@clerk/nextjs";
import Link from "next/link";

const CreatePostWizard = () => {
  const { user } = useUser();

  console.log(user);

  if (!user) {
    return null;
  }

  return (
    <div className="flex w-full gap-3 bg-red-200">
      <img
        src={user.profileImageUrl}
        alt="Profile Image"
        className="h-16 w-16 rounded-full"
      />
      <input
        placeholder="Type some emojis!"
        className=" grow bg-transparent text-black outline-none"
      />
    </div>
  );
};

type PostWithUser = RouterOutputs["posts"]["getAll"][number];

const PostView = (props: PostWithUser) => {
  const { post, author } = props;
  return (
    <div key={post.id} className="flex border-b border-slate-400 p-8">
      <img
        src={author.profilePicture}
        alt="Profile picture"
        className="h-16 w-16 rounded-full"
      />
      {post.content}
    </div>
  );
};

const Home: NextPage = () => {
  const user = useUser();

  const { data, isLoading } = api.posts.getAll.useQuery();

  if (!data || isLoading) return <div>Loading...</div>;

  if (!data) return <div>Something went wrong.</div>;

  // setup changes
  return (
    <>
      <Head>
        <title>Temoji</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-full justify-center">
        <div className="w-full border-x border-slate-400  md:max-w-xl">
          <div className="border-b border-slate-400 p-4">
            {!user.isSignedIn && <SignInButton />}
            {user.isSignedIn && <CreatePostWizard />}
          </div>
          <div className="flex flex-col">
            {[...data, ...data]?.map((fullPost) => (
              <PostView {...fullPost} key={fullPost.post.id} />
            ))}
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
