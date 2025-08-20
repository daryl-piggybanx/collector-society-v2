export type FormData = {
  is_returning_collector: boolean
  is_discord_collector: boolean
  is_reservation_collector: boolean
  rules_accepted: boolean[]
  first_name: string
  last_name: string
  discord_username?: string
  instagram_handle?: string
  collection_reason?: string
  interests?: string
  email: string
  phone_number?: string
  communication_preference?: string
  marketing_consent: boolean
  piece_count?: string
  first_piece?: string
  proof_of_piece?: string[]
  favorite_variation?: string
  favorite_variation_2?: string
  favorite_variation_3?: string
  collect_preferences?: string[] | undefined
  category_to_add?: string
  community_experience?: string
  improvements?: string
  wall_piece_1?: string
  wall_piece_2?: string
  wall_piece_3?: string
  wall_piece_4?: string
  wall_piece_5?: string
  shipping_address_line_1?: string
  shipping_address_line_2?: string
}

export const initialFormData: FormData = {
  is_returning_collector: false,
  is_discord_collector: false,
  is_reservation_collector: false,
  rules_accepted: [false, false, false, false],
  first_name: "",
  last_name: "",
  discord_username: "",
  instagram_handle: "",
  collection_reason: "",
  interests: "",
  email: "",
  phone_number: "",
  communication_preference: "",
  marketing_consent: false,
  piece_count: "",
  first_piece: "",
  proof_of_piece: [],
  favorite_variation: "",
  favorite_variation_2: "",
  favorite_variation_3: "",
  collect_preferences: [],
  category_to_add: "",
  community_experience: "",
  improvements: "",
  wall_piece_1: "",
  wall_piece_2: "",
  wall_piece_3: "",
  wall_piece_4: "",
  wall_piece_5: "",
  shipping_address_line_1: "",
  shipping_address_line_2: "",
} 