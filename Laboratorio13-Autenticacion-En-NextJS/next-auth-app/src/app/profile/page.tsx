import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

import Image from "next/image";

const ProfilePage = async () => {
  const session = await getServerSession(authOptions);
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl text-gray-900 font-bold mb-4">Perfil</h1>

          <div className="mb-6">
            <p className="text-gray-700 mb-2">
              Nombre: <span className="font-semibold">{session?.user?.name}</span>
            </p>
            <p className="text-gray-700 mb-2">
              Correo: <span className="font-semibold">{session?.user?.email}</span>
            </p>
            {session?.user?.image && (
                <>
                    <p className="text-gray-700 mb-2">
                        Imagen de perfil:
                    </p>
                    <Image
                        height={100}
                        width={100}
                        src={session.user.image}
                        alt="Perfil"
                        className="w-16 h-16 rounded-full mt-4"
                    />
                </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
