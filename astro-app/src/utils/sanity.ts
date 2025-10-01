import { sanityClient } from "sanity:client";
import type { PortableTextBlock } from "@portabletext/types";
import type { ImageAsset, Slug } from "@sanity/types";
import groq from "groq";

export async function getPosts(): Promise<Post[]> {
  return await sanityClient.fetch(
    groq`*[_type == "post" && defined(slug.current)] | order(_createdAt desc)`
  );
}

export async function getPost(slug: string): Promise<Post> {
  return await sanityClient.fetch(
    groq`*[_type == "post" && slug.current == $slug][0]`,
    {
      slug,
    }
  );
}

export async function getReviews(): Promise<Review[]> {
  return await sanityClient.fetch(
    groq`*[_type == "review"] | order(_createdAt desc)`
  );
}

export async function getShows(): Promise<Show[]> {
  return await sanityClient.fetch(
    groq`*[_type == "show"] | order(date asc)`
  );
}

export async function getPodcasts(): Promise<Podcast[]> {
  return await sanityClient.fetch(
    groq`*[_type == "podcast"] | order(_createdAt desc)`
  );
}

export async function getSpecials(): Promise<Special[]> {
  return await sanityClient.fetch(
    groq`*[_type == "special"] | order(_createdAt desc)`
  );
}

export interface Post {
  _type: "post";
  _createdAt: string;
  title?: string;
  slug: Slug;
  excerpt?: string;
  mainImage?: ImageAsset & { alt?: string };
  body: PortableTextBlock[];
}

export interface Review {
  _type: "review";
  _createdAt: string;
  title: string;
  text: PortableTextBlock[];
  starRating: number;
}

export interface Show {
  _type: "show";
  _createdAt: string;
  date: string;
  location: string;
  description?: string;
  link: string;
  soldOut: boolean;
}

export interface Podcast {
  _type: "podcast";
  _createdAt: string;
  title: string;
  description: string;
}

export interface Special {
  _type: "special";
  _createdAt: string;
  title: string;
  description: PortableTextBlock[];
  details?: string;
  youtubeId: string;
}
