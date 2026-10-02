import { apiFetch } from '@/lib/api';

export async function getMyProfile() {
  const data = await apiFetch('/students/me/dashboard');
  return data.profile;
}

export async function getMyDashboard() {
  return apiFetch('/students/me/dashboard');
}

export async function askMaterialQuestion(
  materialId: number | string,
  question: string
) {
  return apiFetch(
    `/students/me/materials/${materialId}/ask`,
    {
      method: 'POST',
      body: JSON.stringify({
        question,
      }),
    }
  );
}