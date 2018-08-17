// @flow

import * as React from 'react'
import groupBy from 'lodash/groupBy'
import { connect } from 'react-redux'

import type { File } from '~/services/types'
import { setSongPlaylist } from '~/redux/songs'

import Popup from './Popup'
import Dropdown from './Dropdown'
import AlbumInfo from './AlbumInfo'
import SubDropdown from './SubDropdown'

type Props = {|
  songs: Array<Object>,
  selected: ?Object,
  setSongPlaylist: typeof setSongPlaylist,
|}
type State = {|
  showPlaylistPopup: number | null,
|}

class ContentCard extends React.Component<Props, State> {
  state = {
    showPlaylistPopup: null,
  }

  showPlaylistPopupInput = (e: SyntheticInputEvent<HTMLInputElement>) => {
    e.preventDefault()
    this.setState({ showPlaylistPopup: Date.now() })
  }

  handleSongsShuffleAll = () => {
    const songsList = this.props.songs
    let songsIdsArr = []
    songsList.forEach(song => {
      songsIdsArr.push(song.id)
    })
    this.props.setSongPlaylist(songsIdsArr)
  }

  render() {
    const { songs, selected } = this.props
    const { showPlaylistPopup } = this.state

    let songsToShow = songs
    if (selected) {
      if (selected.type === 'artist') {
        songsToShow = songs.filter(item => item.meta && item.meta.artists.includes(selected.identifier))
      } else if (selected.type === 'genre') {
        songsToShow = songs.filter(item => item.meta && item.meta.genre && item.meta.genre.includes(selected.identifier))
      }
    }
    const songsByAlbums = groupBy(songsToShow, 'meta.album')

    let songsIdsArr = []
    songsToShow.forEach(song => {
      songsIdsArr.push(song.id)
    })

    return (
      <div className="section-artist" id={selected ? selected.identifier : 'allArtists'}>
        {showPlaylistPopup && <Popup hash={showPlaylistPopup.toString()} songsIds={songsIdsArr} />}
        <div className="space-between section-artist-header">
          <div>
            <h2>{selected ? selected.identifier : 'All Artists'}</h2>
            <p>
              {Object.keys(songsByAlbums).length} albums, {songsToShow.length} songs
            </p>
          </div>
          <Dropdown>
            <div className="align-center space-between sub-dropdown-trigger">
              <a>Add to Playlist</a>
              <SubDropdown>
                <a onClick={this.showPlaylistPopupInput} className="dropdown-option">
                  New Playlist
                </a>
              </SubDropdown>
            </div>
            <a className="dropdown-option" onClick={this.handleSongsShuffleAll}>
              Shuffle All
            </a>
            <a className="dropdown-option">Play Next</a>
            <a className="dropdown-option">Play Later</a>
            <a className="dropdown-option">Delete from Library</a>
          </Dropdown>
        </div>
        {Object.keys(songsByAlbums).map(albumName => (
          <AlbumInfo name={albumName} key={albumName} songs={songsByAlbums[albumName]} />
        ))}
      </div>
    )
  }
}

export default connect(null, { setSongPlaylist })(ContentCard)
