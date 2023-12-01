import { request, gql } from 'graphql-request';

const graphqlAPI = process.env.NEXT_PUBLIC_GRAPHCMS_ENDPOINT

export const getPosts = async () => {
  const query = gql`
  query MyQuery{
    postsConnection {
      edges {
        node {
          author {
            bio
            name
            id
            photo {
              url
            }
          }
          createdAt
          slug
          title
          excerpt
          featuredImage {
            url
          }
          categories {
            slug
            name
          }
        }
      }
    }
  }
`  

  const result = await request(graphqlAPI!, query);

  return result.postsConnection.edges;


};


export const getPostDetails = async (slug: string | undefined) => {
  if (slug !== undefined) {
  const query = gql`
    query GetPostDetails($slug : String!) {
      post(where: {slug: $slug}) {
        title
        excerpt
        featuredImage {
          url
        }
        author{
          name
          bio
          photo {
            url
          }
        }
        createdAt
        slug
        content {
          raw
        }
        categories {
          name
          slug
        }
      }
    }
  `;
  const result = await request(graphqlAPI!, query, { slug });

  return result.post;
} else {
  console.error('Slug is undefined');
  return null; // or handle it according to your application's logic
}
};


export const getRecentPosts = async (categories: string[] | undefined, slug: string | undefined) => {
  if (categories !== undefined && slug !== undefined) {
  const query = gql`
    query GetPostDetails() {
      posts(
        orderBy: createdAt_ASC
        last: 3
      ) {
        title
        featuredImage {
          url
        }
        createdAt
        slug
      }
    }
  `;
  const result = await request(graphqlAPI!, query, { slug, categories });

    return result.posts;
  } else {
    console.error('Categories or slug is undefined');
    return null; // or handle it according to your application's logic
  }
};

export const getSimilarPosts = async (categories: string[] | undefined, slug: string | undefined) => {
  if (categories !== undefined && slug !== undefined) {
    const query = gql`
      query GetSimilarPosts($slug: String!, $categories: [String!]) {
        posts(where: { slug_not: $slug, AND: { categories_some: { slug_in: $categories } } }, last: 3) {
          title
          featuredImage {
            url
          }
          createdAt
          slug
        }
      }
    `;
    const result = await request(graphqlAPI!, query, { slug, categories });

    return result.posts;
  } else {
    console.error('Categories or slug is undefined');
    return null; // or handle it according to your application's logic
  }
};

export const getCategories = async () => {
  const query = gql`
    query GetGategories {
        categories {
          name
          slug
        }
    }
  `;

  const result = await request(graphqlAPI!, query);

  return result.postsConnection.edges;
};

export const submitComment = async (obj: any) => {
  const result = await fetch('/api/comments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(obj),
  });

  return result.json();
};

export const getComments = async (slug: string | undefined) => {
  if (slug !== undefined) {
    const query = gql`
      query GetComments($slug: String!) {
        comments(where: { post: { slug: $slug } }) {
          name
          createdAt
          comment
        }
      }
    `;

    const result = await request(graphqlAPI!, query, { slug });

    return result.comments;
  } else {
    console.error('Slug is undefined');
    return null; // or handle it according to your application's logic
  }
};
