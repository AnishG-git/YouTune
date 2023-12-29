// SearchResultsTable.js
import React from 'react';
import './SearchTable.css';
const SearchResultsTable = ({ searchResults }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Song</th>
          <th>Artist</th>
          <th>Duration (s)</th>
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
