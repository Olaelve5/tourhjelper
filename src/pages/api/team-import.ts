import type { NextApiRequest, NextApiResponse } from 'next'
import { exec } from 'child_process'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
      const { id } = req.body;
      const teamPromise = new Promise((resolve, reject) => {
                exec(`source src/python_scripts/venv/bin/activate && python3 src/python_scripts/import_team.py ${id}`, (error, stdout, stderr) => {
                    if (error) {
                        console.error(`exec error: ${error}`);
                        reject(error);
                    }
                    resolve(stdout);
                },
            )});
        
      const team = await teamPromise;
      return res.status(200).json({ team });
  } 
  else {
    return res.status(405).json({ message: 'Method Not Allowed' })
  }
}