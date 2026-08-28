const Page = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">Welcome to Campus Gear</h1>
      <p className="mt-4 text-lg text-gray-600">
        Own the weekend, not the gear.
      </p>
      <div className="mt-8">
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Page;
