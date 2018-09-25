// @flow

import * as React from 'react'
import connect from '~/common/connect'

import db from '~/db'
import { incrementNonce } from '~/redux/songs'

import Popup from './Popup'

type Props = {|
  id: number,
  name: string,
  handleClose: () => void,
  incrementNonce: () => void,
|}
type State = {|
  name: string,
|}

class EditPlaylist extends React.Component<Props, State> {
  state = {
    name: '',
  }

  handleChange = (event: SyntheticInputEvent<HTMLInputElement>) => {
    this.setState({ name: event.target.value.trim() })
  }

  savePlaylist = () => {
    const { name } = this.state
    const { name: playlistName, id, handleClose, incrementNonce: incrementNonceProp } = this.props
    db.playlists.update(id, {
      name: name !== '' ? name : playlistName,
    })
    incrementNonceProp()
    handleClose()
  }

  render() {
    const { name } = this.state
    const { name: playlistName, handleClose } = this.props

    const enable = name !== ''

    return (
      <Popup handleClose={handleClose}>
        <label htmlFor="name">
          Name
          <input id="name" type="text" name="name" value={name} onInput={this.handleChange} placeholder={playlistName} />
        </label>
        <button type="submit" className="btn-blue-border" onClick={this.savePlaylist} disabled={!enable}>
          Save
        </button>
      </Popup>
    )
  }
}

export default connect(
  null,
  { incrementNonce },
)(EditPlaylist)
