import {getCollection} from 'astro:content';
export async function publishedComics(){
 const all=await getCollection('comics',({data})=>data.status==='published' && data.date <= new Date());
 const seen=new Set<number>();
 for(const comic of all){if(seen.has(comic.data.number))throw new Error(`Duplicate comic number: ${comic.data.number}`);seen.add(comic.data.number); if(!comic.data.images.length)throw new Error(`Published comic ${comic.data.number} has no images`);}
 return all.sort((a,b)=>b.data.number-a.data.number);
}
export const comicUrl=(n:number)=>`/comic/${String(n).padStart(3,'0')}/`;
