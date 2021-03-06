// @flow

import React from 'react'

import getEventPath from '~/common/getEventPath'

import flex from '~/styles/flex.less'
import button from '~/styles/button.less'
import dropdown from '~/styles/dropdown.less'

type Props = {|
  classname?: ?string,
  children: React$Node,
|}

type State = {|
  opened: boolean,
|}

export default class Dropdown extends React.Component<Props, State> {
  static defaultProps = {
    classname: null,
  }
  state = { opened: false }
  ref: ?HTMLDivElement = null

  componentDidMount() {
    document.addEventListener('click', this.handleBodyClick)
    document.addEventListener('keydown', this.handleKeyPress)
  }
  componentWillUnmount() {
    document.removeEventListener('click', this.handleBodyClick)
    document.removeEventListener('keydown', this.handleKeyPress)
  }

  handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Escape') this.setState({ opened: false })
  }
  handleBodyClick = (e: MouseEvent) => {
    const { opened } = this.state
    const firedOnSelf = getEventPath(e).includes(this.ref)
    if (opened || firedOnSelf) this.setState({ opened: !opened })
  }

  render() {
    const { opened } = this.state
    const { children, classname } = this.props

    return (
      <div
        className={`${flex.align_center} ${classname ? `${classname}` : ''}`}
        ref={element => {
          this.ref = element
        }}
      >
        <button type="button" className={`${button.btn} ${button.btn_blue} ${dropdown.btn_trigger}`}>
          <i className="material-icons">more_horiz</i>
        </button>
        <div className={`${dropdown.dropdown_content} ${opened ? '' : 'hidden'}`}>{children}</div>
      </div>
    )
  }
}
