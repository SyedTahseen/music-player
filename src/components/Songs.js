// @flow

import * as React from 'react'
import { connect } from 'react-redux'

import db from '~/db'
import { humanizeDuration } from '~/common/songs'
import { setSongPlaylist } from '~/redux/songs'

type Props = {|
  nonce: number,
  activeSong: number | null,
  setSongPlaylist: setSongPlaylist,
|}
type State = {|
  songs: Array<Object>,
|}

class Songs extends React.Component<Props, State> {
  state = { songs: [] }

  componentDidMount() {
    this.fetchSongs()
  }
  componentWillReceiveProps(newProps) {
    if (newProps.nonce !== this.props.nonce) {
      this.fetchSongs()
    }
  }

  fetchSongs() {
    db.songs
      .where('state')
      .equals('downloaded')
      .toArray()
      .then(songs => {
        this.setState({ songs })
      })
  }

  playAtIndex = (index: number) => {
    this.props.setSongPlaylist({
      songs: this.state.songs.map(song => song.id),
      index,
    })
  }

  render() {
    const { activeSong } = this.props
    const { songs } = this.state

    return (
      <div className="section-songs bound">
        {songs.length ? (
          <React.Fragment>
            <div className="align-center space-between">
              <h2>Songs</h2>
              <button onClick={() => this.playAtIndex(0)}>Play All</button>
            </div>
            <table className="section-songs-table" cellSpacing="0">
              <thead>
                <tr className="table-heading">
                  <th>Title</th>
                  <th>Time</th>
                  <th>Artist</th>
                  <th>Album</th>
                  <th>Genre</th>
                </tr>
              </thead>
              <tbody>
                {songs.map((song, index) => (
                  <tr
                    key={song.sourceId}
                    style={{ cursor: 'pointer' }}
                    onClick={() => this.playAtIndex(index)}
                    className={song.id === activeSong ? 'active' : ''}
                  >
                    <td>{song.meta.name || song.filename}</td>
                    <td>{humanizeDuration(song.duration)}</td>
                    <td>{song.meta.artists_original || 'Unknown'}</td>
                    <td>{song.meta.album || 'Unknown'}</td>
                    <td>{song.meta.genre || 'Unknown'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </React.Fragment>
        ) : (
          <div className="align-center justify-center" style={{ height: 300 }}>
            <h2 className="replacement-text">Add Music</h2>
          </div>
        )}
      </div>
    )
  }
}

export default connect(
  ({ songs }) => ({ nonce: songs.nonce, activeSong: songs.playlist[songs.songIndex] || null }),
  { setSongPlaylist },
)(Songs)
