// @flow

import * as React from 'react'

import { connect } from 'react-redux'
import contextMenu from '~/common/contextMenu'
import getEventPath from '~/common/getEventPath'
import { type RouterRoute } from '~/redux/router'
import { humanizeDuration } from '~/common/songs'
import { setSongPlaylist, songPlay, songPause } from '~/redux/songs'

import flex from '~/styles/flex.less'
import table from '~/styles/table.less'
import button from '~/styles/button.less'
import ContextMenu from '~/components/ContextMenu'
import SongDropdown from '~/components/Dropdown/SongDropdown'

type Props = {|
  id: number,
  title: string,
  songState: string,
  dispatch: Function,
  playlist?: ?Object,
  route: RouterRoute,
  songs: Array<Object>,
  activeSong: number | null,
|}

type State = {|
  focusedSong: ?Object,
  selected: Array<number>,
  showContextMenu: boolean,
|}

const SHOW_SEARCHED_SONG = 1200

class SongsTable extends React.Component<Props, State> {
  ref: ?HTMLTableSectionElement = null
  static defaultProps = {
    playlist: null,
  }

  state = {
    selected: [],
    focusedSong: null,
    showContextMenu: false,
  }

  componentDidMount() {
    const { route } = this.props
    if (route.name === 'Songs') this.briefSelect()
    document.addEventListener('click', this.handleBodyClick)
  }

  componentDidUpdate(prevProps) {
    const { id, route } = this.props
    if (route.name === 'Songs' && prevProps.id !== id) this.briefSelect()
  }

  componentWillUnmount() {
    clearTimeout(this.timeoutID)
    document.removeEventListener('click', this.handleBodyClick)
  }

  briefSelect = () => {
    const { id } = this.props

    const element = document.getElementById(`song${id}`)
    if (element) element.scrollIntoView()

    this.setState({
      selected: [id],
    })

    this.timeoutID = setTimeout(() => {
      this.setState({ selected: [] })
    }, SHOW_SEARCHED_SONG)
  }

  handleBodyClick = (e: MouseEvent) => {
    if (e.defaultPrevented) return
    const firedOnSelf = getEventPath(e).includes(this.ref)
    if (!firedOnSelf) this.setState({ selected: [] })
  }

  playAtIndex = (index: number) => {
    const { songs, dispatch } = this.props
    dispatch(
      setSongPlaylist({
        songs: songs.map(song => song.id),
        index,
      }),
    )
  }

  playPause = () => {
    const { songState, dispatch } = this.props
    dispatch(songState === 'playing' ? songPause() : songPlay())
  }

  contextMenu = async (song, e) => {
    e.preventDefault()
    e.persist()
    const elt = document.getElementById('modal-contextmenu-root')
    if (elt) {
      const { menuPostion } = await contextMenu(e, elt)
      this.left = `${menuPostion.x}px`
      this.top = `${menuPostion.y}px`
      this.setState({
        focusedSong: song,
        showContextMenu: true,
      })
    }
  }

  selectRow = (e, id: number) => {
    const { selected } = this.state
    const selectedItems = selected.slice()
    const index = selected.indexOf(id)
    if (index === -1) {
      if (e.shiftKey) {
        this.setState({
          selected: [...selected, id],
        })
        return
      }
      this.setState({
        selected: [id],
      })
    } else {
      if (e.shiftKey) {
        selectedItems.splice(index, 1)
        this.setState({
          selected: selectedItems,
        })
        return
      }
      this.setState({
        selected: [],
      })
    }
  }

  top: string
  left: string
  timeoutID: TimeoutID

  render() {
    const { selected, showContextMenu, focusedSong } = this.state
    const { activeSong, songs, title, playlist, songState } = this.props

    return (
      <div className={`${table.section_songs} bound`}>
        {showContextMenu && focusedSong && (
          <ContextMenu
            top={this.top}
            left={this.left}
            songsIds={selected.length ? selected : [focusedSong.id]}
            handleClose={() => this.setState({ showContextMenu: false, focusedSong: null, selected: [] })}
          />
        )}
        <div className={`${flex.align_center} ${flex.space_between}`}>
          <h2>{title}</h2>
          <button type="button" className={`${button.btn} ${button.btn_playall}`} onClick={() => this.playAtIndex(0)}>
            Play All
          </button>
        </div>
        <table cellSpacing="0">
          <thead>
            <tr>
              <th />
              <th>Title</th>
              <th>Time</th>
              <th>Artist</th>
              <th>Album</th>
              <th>Genre</th>
              <th />
            </tr>
          </thead>
          <tbody
            ref={element => {
              this.ref = element
            }}
            style={{ overflow: `${showContextMenu ? 'hidden' : 'scroll'}` }}
          >
            {songs.map((song, index) => (
              <tr
                id={`song${song.id}`}
                key={song.id}
                onClick={e => this.selectRow(e, song.id)}
                onDoubleClick={() => this.playAtIndex(index)}
                onContextMenu={e => this.contextMenu(song, e)}
                className={`${song.id === activeSong ? `${table.active_song}` : ''} ${
                  selected.includes(song.id) ? `${table.selected}` : ''
                }`}
              >
                {song.id === activeSong ? (
                  <td className={`${table.playingSongIcon}`}>
                    <button type="button" className={`${button.btn} ${button.btn_blue}`} onClick={() => this.playPause()}>
                      <i title={songState === 'playing' ? 'Pause' : 'Play'} className="material-icons">
                        {songState === 'playing' ? 'pause' : 'play_arrow'}
                      </i>
                    </button>
                  </td>
                ) : (
                  <td className={`${table.hover_btns}`}>
                    <button
                      type="button"
                      onClick={() => this.playAtIndex(index)}
                      className={`${button.btn} ${button.btn_blue}`}
                    >
                      <i className="material-icons">play_arrow</i>
                    </button>
                  </td>
                )}
                <td>{song.meta.name || song.filename}</td>
                <td>{song.duration ? humanizeDuration(song.duration) : ''}</td>
                <td>{song.meta.artists_original || 'Unknown'}</td>
                <td>{song.meta.album || 'Unknown'}</td>
                <td>{song.meta.genre || 'Unknown'} </td>
                <td className={` ${selected.includes(song.id) ? `${table.selected_row}` : `${table.hover_btns}`}`}>
                  <SongDropdown song={song} playlist={playlist} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
}

export default connect(({ router, songs }) => ({
  id: router.route.id,
  route: router.route,
  songState: songs.songState,
  activeSong: songs.playlist[songs.songIndex] || null,
}))(SongsTable)
