// @flow

import * as React from 'react'
import { connect } from 'react-redux'

import { deleteSongsFromLibrary } from '~/common/songs'
import { incrementNonce, playLater, setSongPlaylist } from '~/redux/songs'

import flex from '~/styles/flex.less'
import button from '~/styles/button.less'

import Dropdown from './Dropdown'
import AddToPlaylist from './AddToPlaylist'

type Props = {|
  songsIds: Array<number>,
  incrementNonce: () => void,
  playLater: typeof playLater,
  setSongPlaylist: typeof setSongPlaylist,
|}
type State = {||}

class ContentCardDropdown extends React.Component<Props, State> {
  playAtIndex = (index: number) => {
    const { setSongPlaylist: setSongPlaylistProp, songsIds } = this.props
    setSongPlaylistProp({
      songs: songsIds,
      index,
    })
  }

  deleteSong = (ids: Array<number>) => {
    const { incrementNonce: incrementNonceProp } = this.props
    deleteSongsFromLibrary(ids)
    incrementNonceProp()
  }

  render() {
    const { songsIds, playLater: playLaterProp } = this.props

    return (
      <Dropdown>
        <AddToPlaylist songsIds={songsIds} />
        <button className={`${button.btn} ${flex.justify_start}`} type="button" onClick={() => this.playAtIndex(0)}>
          <i className="material-icons">music_note</i>
          Play Now
        </button>
        <button className={`${button.btn} ${flex.justify_start}`} type="button" onClick={() => playLaterProp(songsIds)}>
          <i className="material-icons">watch_later</i>
          Play Later
        </button>
        <button className={`${button.btn} ${flex.justify_start}`} type="button" onClick={() => this.deleteSong(songsIds)}>
          <i className="material-icons">delete</i>
          Delete from Library
        </button>
      </Dropdown>
    )
  }
}

export default connect(
  null,
  { incrementNonce, playLater, setSongPlaylist },
)(ContentCardDropdown)
