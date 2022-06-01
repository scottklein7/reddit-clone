import { LinkIcon, PhotographIcon } from "@heroicons/react/outline"
import { useSession } from "next-auth/react"
import Avatar from "./Avatar"
import { useForm } from 'react-hook-form'
import { useState } from "react"
import { useMutation } from "@apollo/client"
import { ADD_POST, ADD_SUBREDDIT } from "../graphql/mutations"
import client from "../apollo-client"
import { GET_ALL_POSTS, GET_SUBREDDIT_BY_TOPIC } from "../graphql/queries"
import toast from "react-hot-toast"

type FormData = {
    postTitle: string,
    postBody: string,
    postImage: string,
    subreddit: string
}

type Props = {
    subreddit?: string
}

function PostBox({ subreddit }: Props) {
    const { data: session } = useSession()
    const [addPost] = useMutation(ADD_POST, {
        refetchQueries: [
            GET_ALL_POSTS,
        ]
    })
    const [addSubreddit] = useMutation(ADD_SUBREDDIT)

    const [imageBoxOpen, setImageBoxOpen] = useState(false)
    const {
        register,
        setValue,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<FormData>()

    const onSubmit = handleSubmit(async (formData) => {
        const notification = toast.loading('Creating new post')
        try {
            const { data: { getSubredditListByTopic } } = await client.query({
                query: GET_SUBREDDIT_BY_TOPIC,
                variables: {
                    topic: subreddit || formData.subreddit
                }
            })

            const subredditExists = getSubredditListByTopic.length > 0

            if (!subredditExists) {
                console.log('Subreddit is new')
                const { data: { insertSubreddit: newSubreddit } } = await addSubreddit({
                    variables: {
                        topic: formData.subreddit
                    }
                })

                console.log('creatng post- ', formData)
                const image = formData.postImage || ''

                const { data: { insertPost: newPost } } = await addPost({
                    variables: {
                        body: formData.postBody,
                        image: image,
                        subreddit_id: newSubreddit.id,
                        title: formData.postTitle,
                        username: session?.user?.name
                    }
                })
                console.log("is new post", newPost)
            } else {
                console.log('Using existing subreddit!')
                console.log(getSubredditListByTopic)
                const image = formData.postImage || ''
                const { data: { insertPost: newPost } } = await addPost({
                    variables: {
                        body: formData.postBody,
                        image: image,
                        subreddit_id: getSubredditListByTopic[0].id,
                        title: formData.postTitle,
                        username: session?.user?.name
                    }
                })
            }
            setValue('postBody', '')
            setValue('postImage', '')
            setValue('postTitle', '')
            setValue('subreddit', '')
            toast.success('New post created',
                {
                    id: notification
                })

        } catch (error) {
            toast.error('Whoops something went wrong', {
                id: notification
            })
        }
    })

    return (
        <form onSubmit={onSubmit} className="sticky top-10 z-50 bg-white border border-gray-300 p-2 rounded-sm">
            <div className="flex items-center space-x-3">
                <Avatar />

                <input
                    {...register('postTitle', { required: true })}
                    disabled={!session}
                    className="bg-gray-50 p-2 pl-5 outline-none rounded-md flex-1"
                    type="text"
                    placeholder={session ? subreddit ? `Create a post in r/${subreddit}` : `Create a post by entering a title` : `Login to create a post`} />

                <PhotographIcon onClick={() => setImageBoxOpen(!imageBoxOpen)} className={`h-6 text-gray-300 cursor-pointer ${imageBoxOpen && 'text-blue-500'}`} />
                <LinkIcon className={`text-gray-300 h-6 cursor-pointer`} />
            </div>

            {!!watch('postTitle') && (
                <div className="flex flex-col py-2">
                    <div className="flex items-center px-2">
                        <p className="min-w-[90px]">Body</p>
                        <input
                            className="p-2 m-2 flex-1 bg-blue-50 outline-none"
                            {...register('postBody')} type="text" placeholder="Text (optional)" />
                    </div>

                    {!subreddit && (
                        <div className="flex items-center px-2">
                            <p className="min-w-[90px]">Subreddit</p>
                            <input
                                className="m-2 p-2 flex-1 bg-blue-50 outline-none"
                                {...register('subreddit', { required: true })} type="text" placeholder="i.e react.js" />
                        </div>
                    )}

                    {imageBoxOpen && (
                        <div className="flex items-center px-2">
                            <p className="min-w-[90px]">Image Url</p>
                            <input
                                className="m-2 p-2 flex-1 bg-blue-50 outline-none"
                                {...register('postImage')} type="text" placeholder="Optional..." />
                        </div>
                    )}

                    {Object.keys(errors).length > 0 && (
                        <div className="space-y-2 p-2 text-red-500">
                            {errors.postTitle?.type === 'required' && (
                                <p>- Post Title is required</p>
                            )}

                            {errors.subreddit?.type === 'required' && (
                                <p>- Subreddit is required</p>
                            )}
                        </div>

                    )}

                    {!!watch('postTitle') && (
                        <button type="submit" className=" w-full lg:w-1/2 mx-auto rounded-full bg-blue-400 p-2 text-white">Create Post</button>
                    )}
                </div>
            )}
        </form>
    )
}

export default PostBox