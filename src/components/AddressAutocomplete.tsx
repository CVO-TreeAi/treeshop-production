'use client';
import { useEffect, useRef } from 'react';

type Props = { onPlace: (place: google.maps.places.PlaceResult) => void };

export default function AddressAutocomplete({ onPlace }: Props){
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(()=>{
    if(!inputRef.current) return;
    if(!(window as unknown as { google?: typeof google }).google?.maps?.places) return;
    const ac = new google.maps.places.Autocomplete(inputRef.current!, {
      fields: ['formatted_address','geometry','address_components','place_id']
    });
    ac.addListener('place_changed', ()=>{
      const place = ac.getPlace();
      onPlace(place);
    });
    return ()=>{};
  },[onPlace]);
  return <input ref={inputRef} className="bg-black border border-gray-700 rounded px-3 py-2 text-white w-full" placeholder="Enter address" />
}
