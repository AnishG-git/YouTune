// SearchResultsTable.js
import React from 'react';

const SearchResultsTable = ({ searchResults }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Song</th>
          <th>Artist</th>
          <th>Duration</th>
        </tr>
      </thead>
      <tbody>
        {searchResults.map((result, index) => (
          <tr key={index}>
            <td>{result.title}</td>
            <td>{result.artist}</td>
            <td>{result.duration}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default SearchResultsTable;
