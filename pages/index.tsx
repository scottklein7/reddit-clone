import { useQuery } from '@apollo/client'
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Feed from '../components/Feed'
import Header from '../components/Header'
import PostBox from '../components/PostBox'
import SubredditRow from '../components/SubredditRow'
import { GET_SUBREDDIT_WITH_LIMIT } from '../graphql/queries'

const Home: NextPage = () => {
  const { data } = useQuery(GET_SUBREDDIT_WITH_LIMIT, {
    variables: {
      limit: 10
    }
  })
  const subreddit: Subreddit[] = data?.getSubredditListLimit

  return (
    <div className="max-w-5xl my-7 mx-auto">
      <PostBox />

      <div className="flex">
        <Feed />


        <div className='sticky top-36 mx-5 mt-5 hidden h-fit min-w-[300px] rounded-m border border-gray-300 bg-white lg:inline'>
          <p className="text-md mb-1 p-4 pb-3 font-bold">Top Communities</p>
          <div>
            {subreddit?.map((subreddit, i) => (
              <SubredditRow
                key={subreddit.id}
                topic={subreddit.topic}
                index={i}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
