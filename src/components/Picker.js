// @flow

import React from 'react'
import { compose } from 'recompose'

import db from '~/db'
import { incrementNonce } from '~/redux/songs'
import type { UserAuthorization } from '~/redux/user'

import services from '~/services'
import connect from '~/common/connect'

import flex from '~/styles/flex.less'
import button from '~/styles/button.less'

type Props = {|
  authorizations: Array<UserAuthorization>,
  incrementNonce: () => void,
|}
type State = {||}

class Picker extends React.Component<Props, State> {
  createPicker = (e: SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault()
    const { authorizations } = this.props
    if (!authorizations.length) {
      console.warn('No authorizations found')
      return
    }
    authorizations.forEach(authorization => {
      const { incrementNonce: incrementNonceProp } = this.props
      const service = services.find(item => item.name === authorization.service)
      if (!service) {
        console.warn('Service not found for authorization', authorization)
        return
      }

      service
        .addFiles(authorization)
        .then(filesChosen => {
          db.songs.bulkAdd(filesChosen)
          incrementNonceProp()
        })
        .catch(console.error)
    })
  }

  render() {
    return (
      <button type="button" className={`${button.btn} ${button.add_music} ${flex.align_center}`} onClick={this.createPicker}>
        <i title="Add Music" className="material-icons">
          add
        </i>
        Add Music
      </button>
    )
  }
}

export default compose(
  connect(
    state => ({ authorizations: state.user.authorizations.toArray() }),
    { incrementNonce },
  ),
)(Picker)
