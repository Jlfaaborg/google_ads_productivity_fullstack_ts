# Intro

Hello and welcome. **Google Ads Productivity** is an app designed to be run from a server and is used to add phonecall conversions and website conversions to a Google Ads account. Please note, as of now the app is only available for local development. You will need an .env file in root directory off app with these field: 

GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
GOOGLE_REDIRECT_URL
TEST_ACCOUNT_ID
DEVELOPER_TOKEN

## The Problem

While [GoogleAdsEditor](https://ads.google.com/home/tools/ads-editor/) offers most of the functionality you would want to perform on a daily basis, it does not offer support for uploading conversions in bulk.

## The Solution

My app is designed to allow a user to upload a CSV, edit the uploaded data, and Submit the data to be passed to Google.
Technologies:

 -  **React** front-end written with **Typescript**
 - **Express** back-end to call **Google's Api** using the **Oauth2** workflow
 - **Redux** state management (with  **Hooks**) 



## Download & Run

 - Clone Repo
 - `npm install` in both root folder and ./src
 - Create and active your [OAuth Credentials](https://console.cloud.google.com/apis/dashboard) (using Google Adwords Scope)
 - Create a [Test Manager Account](https://developers.google.com/google-ads/api/docs/first-call/test-accounts) (while in development, only test accounts can be queried)
 - `npm run start` from the root directory

