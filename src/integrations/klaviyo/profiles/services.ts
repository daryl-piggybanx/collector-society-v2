import { createServerFn } from '@tanstack/react-start'
import type { KlaviyoProfile, KlaviyoConsent } from './types'
import { z } from 'zod'
import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js'

export const getProfileByEmail = createServerFn({ method: 'GET' })
  .validator(z.object({
    email: z.string().email()
  }))
  .handler(async ({ data }) => {
    const url = `https://a.klaviyo.com/api/profiles?filter=equals(email,"${data.email}")`;

    const options = {
      method: 'GET',
      headers: {
        'Accept': 'application/vnd.api+json',
        'Authorization': `Klaviyo-API-Key ${process.env.KLAVIYO_API_KEY}`,
        'Revision': '2025-04-15'
      }
    };

    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            throw new Error('Failed to fetch profile');
        }

        const json = await response.json();
        const profile = json.data[0];                    

        // optionally, destructure only the desired fields
        const { type, id, attributes } = profile as KlaviyoProfile;

        // slimmed-down object
        return { type, id, attributes };
    } catch (error) {
        throw new Error('Failed to fetch profile')
    }
  })

export const createUpdateProfile = createServerFn({ method: 'POST' })
  .validator(z.object({
    email: z.string().email(),
    phone_number: z.string().optional(),
    first_name: z.string(),
    last_name: z.string(),
    created: z.string().optional(),
    updated: z.string().optional(),
    marketing_consent: z.boolean(),
    discord_username: z.string().optional(),
    piece_count: z.string().optional(),
    favorite_variation: z.string().optional(),
    favorite_variation_2: z.string().optional(),
    favorite_variation_3: z.string().optional(),
    collect_preferences: z.array(z.string()).optional(),
    communication_preference: z.string().optional(),
    instagram_handle: z.string().optional(),
    collection_reason: z.string().optional(),
    interests: z.string().optional(),
    first_piece: z.string().optional(),
    proof_of_piece: z.array(z.string()).optional(),
    community_experience: z.string().optional(),
    improvements: z.string().optional(),
    is_returning_collector: z.boolean().optional(),
    is_discord_collector: z.boolean().optional(),
    is_reservation_collector: z.boolean().optional(),
    wall_piece_1: z.string().optional(),
    wall_piece_2: z.string().optional(),
    wall_piece_3: z.string().optional(),
    wall_piece_4: z.string().optional(),
    wall_piece_5: z.string().optional(),
    shipping_address_line_1: z.string().optional(),
    shipping_address_line_2: z.string().optional(),
  }))
  .handler(async ({ data }) => {
    const url = 'https://a.klaviyo.com/api/profile-import';

    console.log('test data: ', data);

    const safeParsePhoneNumber = (phoneNumber: string) => {
      try {
        if (!phoneNumber || phoneNumber.trim() === '') return null;
        
        // Try to clean common formatting issues
        const cleanedPhone = phoneNumber.replace(/[^\d+\-\(\)\s]/g, '');
        if (!cleanedPhone) return null;
        
        if (!isValidPhoneNumber(cleanedPhone)) {
          console.warn('Invalid phone number provided, skipping phone validation:', phoneNumber);
          return null;
        }
        return parsePhoneNumber(cleanedPhone);
      } catch (error) {
        console.warn('Error parsing phone number, proceeding without phone validation:', phoneNumber, error);
        return null;
      }
    };

    const parsedPhone = data.phone_number ? safeParsePhoneNumber(data.phone_number) : null;
    const hasValidPhone = parsedPhone !== null;

    const properties: Record<string, any> = {
      '$source': data.is_discord_collector 
                ? 'Discord Verification' 
                : data.is_reservation_collector 
                ? 'Wall-Piece Reservation' 
                : data.is_returning_collector ? 'Update Collector Profile' : 'New Collector Form',
      '$consent_method': 'Custom Klaviyo Form',
      '$consent': hasValidPhone ? ['email', 'sms'] : ['email'],
      '$consent_timestamp': new Date().toISOString(),
      'Accepts Marketing': data.marketing_consent,
    };

    // Add optional properties only if they have values
    if (hasValidPhone && parsedPhone) {
      properties['$phone_number_region'] = parsedPhone.country;
    }
    if (data.discord_username) {
      properties['Discord-Username'] = data.discord_username;
    }
    if (data.piece_count) {
      properties['# of Pieces'] = data.piece_count;
    }
    if (data.piece_count) {
      properties['of-Pieces'] = data.piece_count;
    }
    if (data.favorite_variation) {
      properties['Favorite-Variation'] = data.favorite_variation;
    }
    if (data.favorite_variation_2) {
      properties['Favorite-Variation-2'] = data.favorite_variation_2;
    }
    if (data.favorite_variation_3) {
      properties['Favorite-Variation-3'] = data.favorite_variation_3;
    }
    if (data.collect_preferences?.[0]) {
      properties['Collection Category 1'] = data.collect_preferences[0];
      properties['Collection-Category-1'] = data.collect_preferences[0];
    }
    if (data.communication_preference) {
      properties['Communication-Preference'] = data.communication_preference;
    }
    if (data.instagram_handle) {
      properties['Instagram Handle'] = data.instagram_handle;
    }
    if (data.collection_reason) {
      properties['Collection Reason'] = data.collection_reason;
    }
    if (data.interests) {
      properties['Interests'] = data.interests;
    }
    if (data.first_piece) {
      properties['First Piece'] = data.first_piece;
    }
    if (data.proof_of_piece) {
      properties['Proof of Piece'] = data.proof_of_piece.join(', ');
    }
    if (data.community_experience) {
      properties['Community Experience'] = data.community_experience;
    }
    if (data.improvements) {
      properties['Improve Experience'] = data.improvements;
    }
    if (data.wall_piece_1) {
      properties['Wall-Piece-1'] = data.wall_piece_1;
    }
    if (data.wall_piece_2) {
      properties['Wall-Piece-2'] = data.wall_piece_2;
    }
    if (data.wall_piece_3) {
      properties['Wall-Piece-3'] = data.wall_piece_3;
    }
    if (data.wall_piece_4) {
      properties['Wall-Piece-4'] = data.wall_piece_4;
    }
    if (data.wall_piece_5) {
      properties['Wall-Piece-5'] = data.wall_piece_5;
    }
    if (data.shipping_address_line_1 && data.shipping_address_line_2) {
      properties['Shipping-Address'] = `${data.shipping_address_line_1} ${data.shipping_address_line_2}`;
    }
    if (data.shipping_address_line_1 && !data.shipping_address_line_2) {
      properties['Shipping-Address'] = data.shipping_address_line_1;
    }

    const klaviyoData = {
      data: {
        type: "profile",
        attributes: {
          email: data.email,
          phone_number: hasValidPhone && parsedPhone ? parsedPhone.format('E.164') : undefined,
          first_name: data.first_name,
          last_name: data.last_name,
          properties
        }
      }
    };

    // console.log('test payload to klaviyo: ', klaviyoData);

    const options = {
      method: 'POST',
      headers: {
        'Accept': 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
        'Authorization': `Klaviyo-API-Key ${process.env.KLAVIYO_API_KEY}`,
        'Revision': '2025-04-15'
      },
      body: JSON.stringify(klaviyoData)
    };

    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Klaviyo API Error:', {
          status: response.status,
          statusText: response.statusText,
          errorText,
          requestData: {
            email: data.email,
            hasPhone: !!data.phone_number,
            hasValidPhone,
            source: properties['$source']
          }
        });
        throw new Error(`Klaviyo API Error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const json = await response.json();
      return json;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('createUpdateProfile error details:', {
        email: data.email,
        hasPhone: !!data.phone_number,
        hasValidPhone,
        originalPhone: data.phone_number,
        source: properties['$source'],
        error: errorMessage
      });
      
      // If phone number error, retry without phone data
      if (hasValidPhone && (errorMessage.includes('phone') || errorMessage.includes('Phone'))) {
        console.warn('Retrying profile creation without phone number due to phone-related error');
        try {
          const fallbackData = {
            ...klaviyoData,
            data: {
              ...klaviyoData.data,
              attributes: {
                ...klaviyoData.data.attributes,
                phone_number: undefined,
                properties: {
                  ...properties,
                  '$consent': ['email'],
                  '$phone_number_region': undefined
                }
              }
            }
          };
          
          const retryResponse = await fetch(url, {
            ...options,
            body: JSON.stringify(fallbackData)
          });
          
          if (retryResponse.ok) {
            console.log('Successfully created profile without phone number');
            return await retryResponse.json();
          }
        } catch (retryError) {
          console.error('Retry also failed:', retryError);
        }
      }
      
      throw new Error(`Failed to create/update profile: ${errorMessage}`);
    }
  });


const subscriptionService  = (async (profileData: KlaviyoConsent, listId: string, subscriptionType: string) => {
    const url = 'https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs/';
    const klaviyoData  = {
        "data": {
            "type": "profile-subscription-bulk-create-job",
            "attributes": {
                "profiles": {
                    "data": [
                        {
                            "type": "profile",
                            "attributes": profileData
                        }
                    ]
                }
            },
            "relationships": {
                "list": {
                    "data": {
                        "type": "list",
                        "id": listId
                    }
                }
            }
        }
    };

    const options = {
        method: 'POST',
        headers: {
            accept: 'application/vnd.api+json',
            revision: '2025-04-15',
            'content-type': 'application/vnd.api+json',
            Authorization: `Klaviyo-API-Key ${process.env.KLAVIYO_API_KEY}`,
        },
        body: JSON.stringify(klaviyoData )
    };

    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`${subscriptionType} subscription failed: HTTP ${response.status}: ${response.statusText} - ${errorText}`);
      }

      // handle 202 Accepted response (bulk operations return empty body)
      if (response.status === 202) {
        return {
          success: true,
          message: `${subscriptionType} subscription request accepted and will be processed asynchronously`,
          status: response.status
        };
      }

      // if other successful responses, parse request body
      const responseText = await response.text();
      if (responseText.trim() === '') {
          return {
              success: true,
              message: `${subscriptionType} request successful`,
              status: response.status,
              listId: listId
          };
      }

      const json = JSON.parse(responseText);
      return { ...json, status: response.status };

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        throw new Error(`${subscriptionType} subscription error: ${errorMessage}`);
    }
  });

export const subscribeProfile = createServerFn({ method: 'POST' })
  .validator(z.object({
    email: z.string().email(),
    phone_number: z.string().optional(),
    marketing_consent: z.boolean()
  }))
  .handler(async ({ data }) => {
    const results = [];

    const emailConsent : KlaviyoConsent = {
      email: data.email,
      subscriptions: {
        email: {
          marketing: {
            consent: 'SUBSCRIBED'
          }
        }
      }
    }

    const emailResult = await subscriptionService(emailConsent, process.env.KLAVIYO_EMAIL_LIST_ID!, 'Email');
    results.push(emailResult);

    if (data.marketing_consent) {
      const smsConsent : KlaviyoConsent = {
        email: data.email,
        phone_number: data.phone_number,
        subscriptions: {
          sms: {
            marketing: {
              consent: 'SUBSCRIBED'
            }
          }
        }
      }

      const smsResult = await subscriptionService(smsConsent, process.env.KLAVIYO_SMS_LIST_ID!, 'SMS');
      results.push(smsResult);
    }

    return { 
        success: results.every(r => r.success),
        results: results,
        message: results.every(r => r.success) ? 
            'All subscriptions processed successfully' : 
            'Some subscriptions failed'
    };
  });

export const subscribeProfileDiscord = createServerFn({ method: 'POST' })
  .validator(z.object({
    email: z.string().email(),
    phone_number: z.string().optional(),
    marketing_consent: z.boolean()
  }))
  .handler(async ({ data }) => {
    const emailConsent : KlaviyoConsent = {
      email: data.email,
      subscriptions: {
        email: {
          marketing: {
            consent: 'SUBSCRIBED'
          }
        }
      }
    }

    const emailResult = await subscriptionService(emailConsent, process.env.KLAVIYO_DISCORD_LIST_ID!, 'Discord');
    
    return {
      success: emailResult.success,
      message: emailResult.message
    }
  });

export const subscribeProfileReservation = createServerFn({ method: 'POST' })
.validator(z.object({
  email: z.string().email(),
  phone_number: z.string().optional(),
  marketing_consent: z.boolean()
}))
.handler(async ({ data }) => {
  const emailConsent : KlaviyoConsent = {
    email: data.email,
    subscriptions: {
      email: {
        marketing: {
          consent: 'SUBSCRIBED'
        }
      }
    }
  }

  const emailResult = await subscriptionService(emailConsent, process.env.KLAVIYO_WAITLIST_LIST_ID!, 'Reservation');
  
  return {
    success: emailResult.success,
    message: emailResult.message
  }
});