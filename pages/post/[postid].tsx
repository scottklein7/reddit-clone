import { useQuery } from "@apollo/client"
import { useRouter } from "next/router"
import Post from "../../components/Post"
import { GET_POST_BY_POST_ID } from '../../graphql/queries'


function PostPage() {
    const router = useRouter()
    const { data } = useQuery(GET_POST_BY_POST_ID, {
        variables: {
            post_id: router.query.postid,
        },
    })

    const post: Post = data?.getPostListByPostId
    console.log(router.query.postid)
    return (
        <div className="mx-auto my-7 max-w-5xl">
            <Post post={post} />
        </div>
    )
}

export default PostPage