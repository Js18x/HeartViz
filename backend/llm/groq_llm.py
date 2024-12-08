import json
import os

import requests
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()
GROQ_API_KEY = os.getenv('GROQ_API_KEY')


class GroqClient:
    def __init__(self):
        self.api_key = GROQ_API_KEY
        self.base_url = "https://api.groq.com/openai/v1"

    def generate_answer(self, feature1:str, feature2:str, prompt_file_path:str,word_limit:int):
        url = f"{self.base_url}/chat/completions"
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }

        # Load prompt file
        with open(prompt_file_path, 'r') as file:
            messages_data = json.load(file)

        for message in messages_data["messages"]:
            message["content"] = message["content"].replace("{feature1}", feature1)
            message["content"] = message["content"].replace("{feature2}",feature2)
            message["content"] = message["content"].replace("{word_limit}",str(word_limit))

        # Make the API request
        response = requests.post(url, json={"model": "llama3-8b-8192", "messages": messages_data["messages"]}, headers=headers)
        

        if response.status_code == 200:
            return response.json()["choices"][0]["message"]["content"] 
        else:
            return f"Error: {response.status_code}"
        
def main():
    client = GroqClient()
    print(client.generate_answer('Resting Blood Pressure','Chest Pain'))

if __name__ == "__main__":
    main()