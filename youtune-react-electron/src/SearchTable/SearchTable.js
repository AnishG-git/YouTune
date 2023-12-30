  // SearchResultsTable.js
  import React, {useState} from 'react';
  import './SearchTable.css';
  const SearchResultsTable = ({ searchResults, onSongSelect }) => {
    const [resultClicked, setResultClicked] = useState(null);

    const handleRowClicked = (result) => {
      setResultClicked(result.url);
      onSongSelect(result.audio_url);
    };

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
          {searchResults.map((result) => (
            <tr key={result.id} className={resultClicked===result.url ? 'rowClicked':'tableRow'} onClick={() => handleRowClicked(result)}>
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
