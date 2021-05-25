import { createContext, ReactNode, useContext } from 'react';
// import { PlayerContext } from '../../contexts/PlayerContext';
import { useState } from 'react';
type Episode = {
      title: string;
      members: string;
      thumbnail: string;
      duration: number;
      url: string
}
type PlayerContextData = {
      episodeList: Episode[],
      currentEpisodeIndex: number,
      isPlaying: boolean;
      play: (episode: Episode) => void,
      togglePlay: () => void,
      playList: (list: Episode[], index: number) => void,
      setPlayingState:(state: Boolean) => void,
      playNext: () => void,
      playPreviously: () => void,
      toggleShuffle: () => void,
      isShuffling: boolean
      hasPrevious: boolean,
      hasNext: boolean,
      clearPlayerState: ()=> void,
      isLooping: boolean,
      toggleLoop: () => void,
}

type  PlayerConteextProps = {
      children: ReactNode;
}
export const PlayerContext = createContext({} as PlayerContextData)

export function PlayerContextProvider({ children }: PlayerConteextProps){

const [episodeList, setEpisodeList] = useState([])

const [currentEpisodeIndex, setCurrentEpisodIndex] = useState(0)
const [isPlaying, setPlaying] = useState(false)
const [isLooping, setIsLooping] = useState(false) 
const [isShuffling, setIsShuffling] = useState(false) 

function play(episode: Episode){
  setEpisodeList([episode])
  setCurrentEpisodIndex(0)
  setPlaying(true)
}
function playList(list: Episode[], index: number){
      setEpisodeList(list)
      setCurrentEpisodIndex(index)
      setPlaying(true)

      console.log(list);
      console.log(index);

      console.log(list[index]);
}
function clearPlayerState(){
      setEpisodeList([]);
      setCurrentEpisodIndex(0);
}
const hasPrevious = currentEpisodeIndex > 0
const hasNext = isShuffling || (currentEpisodeIndex + 1) < episodeList.length
function playNext(){
      console.log(isShuffling);
      
      if(isShuffling){
            const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length)
            setCurrentEpisodIndex(nextRandomEpisodeIndex)
      }else if (hasNext){
            setCurrentEpisodIndex(currentEpisodeIndex + 1)
            return
      }

      
      // if(hasNext){
      //       setCurrentEpisodIndex(currentEpisodeIndex + 1)
      // }

}
function playPreviously(){
      console.log(currentEpisodeIndex)
      if(hasPrevious){
            setCurrentEpisodIndex(currentEpisodeIndex - 1)
      }
}
function togglePlay(){
  setPlaying(!isPlaying)
}
function toggleLoop(){
      setIsLooping(!isLooping)
    }

function toggleShuffle(){
      setIsShuffling(!isShuffling)
     
    }
function setPlayingState(state: boolean){
  setPlaying(state)
}

return (
  <PlayerContext.Provider value={{
        episodeList,
        toggleShuffle,
        isShuffling,
        currentEpisodeIndex,
        play,isPlaying,
        togglePlay,
        setPlayingState,
        playList,
        playNext, 
        playPreviously, 
        hasPrevious,
        hasNext,
        clearPlayerState,
        isLooping,
        toggleLoop
        }}>
        {children}
  </PlayerContext.Provider>
      )
}

export const usePlayer = () => {
      return useContext(PlayerContext)
}