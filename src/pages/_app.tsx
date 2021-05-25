import '../styles/global.scss'
import { Header } from "../components/Header"
import styles from '../styles/app.module.scss';
import { Player } from '../components/Player'
import { PlayerContextProvider } from '../contexts/PlayerContext';



function MyApp({ Component, pageProps }) {
  return(
    <PlayerContextProvider>
      {/* tudo que estiver envolta sera passado para outro componente */}
      <div className={styles.wrapper}>
      <main>
        <Header />
        <Component  {...pageProps} />
      </main>
      <Player/>
    </div>
  </PlayerContextProvider>

  )
}

export default MyApp
