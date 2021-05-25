import { GetStaticProps } from 'next'
import { useContext } from 'react';
import Head from 'next/head'
import { PlayerContext, usePlayer } from '../contexts/PlayerContext';
import { api } from '../services/api';
import Link  from 'next/link';
import ptBR from 'date-fns/locale/pt-BR';
import Image from 'next/image'
import styles from './home.module.scss'
import { format, parseISO } from 'date-fns';
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString';
type Episode = {
  id: string;
  title: string;
  thumbnail: string;
  members: string;
  publishedAt: string;
  duration: number;
  description: string;
  durationAssString: string;
  url: string
}
type HomeProps = {
  // episodes: Array<Episode>
  //Ou assim: 
    latesteEpisodes: Array<Episode>;
    allEpisodes: Episode[]

  // <>isso é o que vai falar pro Array o que ele é
}

export default function Home({latesteEpisodes, allEpisodes}: HomeProps) {
  const { playList } = usePlayer()
  const episodeList = [...latesteEpisodes, ...allEpisodes]
  console.log(episodeList)
  return (
    <div className={styles.homepage}>
      <Head>
        <title>Home | Podcastr </title>
      </Head>
      <section className={styles.latestEpisodes}>
          <h2>Últimos lançamentos</h2>
          <ul>
            {latesteEpisodes.map((episode, idx) => {
              return(
                <li key={episode.id}>
                 <Image
                  width={192}
                  height={192}
                  src={episode.thumbnail}
                  alt={episode.title}
                  objectFit="cover"
                  />
                 <div className={styles.episodeDetails}>
                   <Link href={`/episodes/${episode.id}`}>
                          <a>{episode.title}</a>
                   </Link>
                    {/* O link, é pra ser usado quando vc quer navegar, e não quer recarregar toda a aplicação novamente */}
                    {/* <p>{episode.publishedAt}</p> */}
                    <p>{episode.members}</p>
                    {/* <span>{episode.publishedAt}</span> */}
                    <span>{episode.publishedAt}</span>
                    <span>{episode.durationAssString}</span>
                 </div>

                <button type="button" onClick={() => playList(episodeList, idx)}>
                  <img src="/play-green.svg" alt="Tocar episódio"/>
                </button>

                </li>
              )
            })}
          </ul>
      </section>

      <section className={styles.allEpisodes}>
            <h2>Todos episódios</h2>

            <table cellSpacing={0}>
              <thead>
                <th></th>
                <th>Podcast</th>
                <th>Integrantes</th>
                <th>Data</th>
                <th>Duração</th>
                <th></th>
              </thead>

                <tbody>
                  {allEpisodes.map((episode, idx) => {
                    return(
                      <tr key={episode.id}>
                        <td style={{ width: 72 }}>
                          <Image
                            width={120}
                            height={120}
                            src={episode.thumbnail}
                            alt={episode.title}
                            objectFit="cover"
                          />
                        </td>
                        <td>
                        <Link href={`/episodes/${episode.id}`}>
                          <a>{episode.title}</a>
                       </Link>
                          {/* <a href="">{episode.title}</a> */}
                        </td>
                        <td>{episode.members}</td>
                        <td style={{ width: 100 }}>{episode.publishedAt}</td>
                        <td>{episode.durationAssString}</td>
                        <td>
                          <button type="button" onClick={() => playList(episodeList, idx + latesteEpisodes.length)}>
                            <img src="/play-green.svg" alt="Tocar episódio"/>
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
            </table>
      </section>
    </div>
  )
}

//key server para performace de não repetição

//Metodo SSR
// export async function getServerSideProps(){
//   const response = await fetch('http://localhost:3333/episodes')
//   const data = await response.json()

//   return{
//     props:{
//       episodes: data
//     }
//   }
// }
//Essa é a forma para deixar a requisição em cache
export const getStaticProps: GetStaticProps = async () =>{
  const config = {
    params:{
      _limit:12,
      _sort:'published_at',
      _order:'desc'
    }
  }
  // const { data } = await api.get('episodes?_limit=12&_sort=published_at&_order=desc', {})
  const { data } = await api.get('episodes', config)
  
  const episodes = data.map(episode => {
    return{
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', { locale: ptBR }),
      duration: Number(episode.file.duration),
      description: episode.description,
      durationAssString: convertDurationToTimeString(Number(episode.file.duration)),
      url: episode.file.url,
    }
  })
//42 min
  //  episodes.reverse()
  const latesteEpisodes = episodes.slice(0, 2);
  const allEpisodes = episodes.slice(2, episodes.length)
  return{
    props:{
      latesteEpisodes,
      allEpisodes
    },
    revalidate: 60 * 60 * 8
  }
}