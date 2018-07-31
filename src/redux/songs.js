// @flow

import { createAction, handleActions } from 'redux-actions'

const SONG_TO_PLAY = 'SONGS/SONG_TO_PLAY'
const SET_SELECTED = 'SONGS/SET_SELECTED'
const INCREMENT_NONCE = 'SONGS/INCREMENT_NONCE'

export const songToPlay = createAction(SONG_TO_PLAY)
export const setSelected = createAction(SET_SELECTED)
export const incrementNonce = createAction(INCREMENT_NONCE)

export type SongsStateSelected = {|
  type: 'album' | 'artist' | 'playlist' | 'genre',
  identifier: string,
|}
export type SongToPlayState = {|
  name: string,
  sourceId: string,
  sourceUid: string,
  artists: Array<string>,
|}
export type SongsState = {|
  nonce: number,
  songToPlay: ?SongToPlayState,
  selected: ?SongsStateSelected,
|}

const defaultState: SongsState = {
  nonce: 0,
  selected: null,
  songToPlay: null,
}

export const hydrators = {}
export const reducer = handleActions(
  {
    [INCREMENT_NONCE]: (state: SongsState) => ({
      ...state,
      nonce: state.nonce + 1,
    }),
    [SET_SELECTED]: (state: SongsState, { payload: selected }) => ({
      ...state,
      selected,
    }),
    [SONG_TO_PLAY]: (state: SongsState, { payload: songToPlay }) => ({
      ...state,
      songToPlay,
    }),
  },
  defaultState,
)
