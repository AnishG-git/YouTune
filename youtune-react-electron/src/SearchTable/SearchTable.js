  // SearchResultsTable.js
  import React, {useState} from 'react';
  import './SearchTable.css';
  const SearchResultsTable = ({ searchResults, onSongSelect }) => {
    const [rowClicked, setRowClicked] = useState(null);

    const handleRowClicked = (result) => {
      // to change css
      setRowClicked(result.url);
      // to pass to CustomAudioPlayer through Homepage
      onSongSelect(result.audio_url);
    };

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
          {searchResults.map((result) => (
            <tr key={result.id} className={rowClicked===result.url ? 'rowClicked':'tableRow'} onClick={() => handleRowClicked(result)}>
              <td>{result.title}</td>
              <td>{result.artist}</td>
              <td>{Math.floor((result.duration)/60).toString() + ":" + (result.duration % 60).toString().padStart(2, '0')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  export default SearchResultsTable;
