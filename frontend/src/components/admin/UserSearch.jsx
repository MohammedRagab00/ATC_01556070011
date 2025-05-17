import { useState } from "react";

const UserSearch = ({ onSearch, isLoading }) => {
  const [emailPattern, setEmailPattern] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate email pattern (minimum 3 characters)
    if (emailPattern.length < 3) {
      setError("Search term must be at least 3 characters long");
      return;
    }

    setError("");
    onSearch(emailPattern);
  };

  return (
    <div className="bg-white rounded-lg shadow p-5 mb-6">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <label
              htmlFor="emailSearch"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Search Users by Email
            </label>
            <input
              type="text"
              id="emailSearch"
              name="emailSearch"
              value={emailPattern}
              onChange={(e) => setEmailPattern(e.target.value)}
              placeholder="Enter email pattern (min. 3 characters)"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              disabled={isLoading}
              className={`h-10 px-4 py-2 rounded-md font-medium text-white ${
                isLoading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              } transition-colors`}
            >
              {isLoading ? "Searching..." : "Search"}
            </button>
          </div>
        </div>
        <p className="mt-2 text-xs text-gray-500">
          Enter at least 3 characters to search for users by their email
          address.
        </p>
      </form>
    </div>
  );
};

export default UserSearch;
