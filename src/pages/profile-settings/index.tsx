import { Button } from "~/components/ui/button";
import { AvatarImage, AvatarFallback, Avatar } from "~/components/ui/avatar";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Card } from "~/components/ui/card";
import { api } from "~/utils/api";
import Image from "next/image";
import { type FormEvent, useState, useEffect } from "react";
import { Trash, User2 } from "lucide-react";
import { supabaseClient } from "~/supabase/server";

interface User {
  name: string;
  email: string;
  image: string | null;
}

export default function ProfileSettings() {
  const { mutate } = api.user.updateDetails.useMutation();
  const utils = api.useUtils();
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<{ name: string; image: string }>({
    name: "",
    image: "",
  });
  const [loading, setLoading] = useState(false);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const user = await utils.user.me.fetch();
      if (user) {
        setUser(user as User);
        setFormData({ name: user.name, image: user.image ?? "" });
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleProfileUpdate = async (e: FormEvent) => {
    e.preventDefault();

    const form = Object.fromEntries(new FormData(e.target as HTMLFormElement));
    const updatedData = { ...formData };

    if (typeof form.image == "object" && form.image.name) {
      try {
        const { data, error } = await supabaseClient.storage
          .from("avatars")
          .upload(form.image.name, form.image, { upsert: true });

        if (error) {
          throw new Error(`Error uploading image: ${error.message}`);
        }

        const { data: imageLink } = supabaseClient.storage
          .from("avatars")
          .getPublicUrl(`${data.path}`);

        updatedData.image = imageLink.publicUrl;
      } catch (error) {
        console.error(error);
      }
    }

    mutate(updatedData, {
      onSettled: () => void fetchUserData(),
    });
  };

  useEffect(() => {
    void fetchUserData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card key="1" className="m-auto w-full max-w-3xl p-8">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <form onSubmit={handleProfileUpdate}>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="file"
                name="image"
                id="image"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setFormData({
                      ...formData,
                      image: URL.createObjectURL(e.target.files[0]),
                    });
                  }
                }}
              />
              {formData.image ? (
                <Image
                  id="profile"
                  alt="User"
                  className="rounded-full"
                  height={150}
                  src={formData.image}
                  style={{
                    aspectRatio: "150/150",
                    objectFit: "cover",
                  }}
                  width={150}
                />
              ) : (
                <User2
                  className="rounded-full bg-slate-400"
                  height={150}
                  width={150}
                />
              )}
              <div className="absolute right-0 top-0 translate-x-2/4">
                {(formData.image || user?.image) && (
                  <Trash
                    className="h-4 w-4"
                    onClick={() => setFormData({ ...formData, image: "" })}
                  />
                )}
                {!formData.image && !user?.image && (
                  <label htmlFor="image">
                    <FileEditIcon className="h-4 w-4" />
                  </label>
                )}
                <span className="sr-only">Edit</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <h2 className="text-2xl font-bold">{user?.name}</h2>
                <Button className="hidden">Open modal</Button>
              </div>
              <p className="text-sm font-medium leading-none peer-[all-&]:-mb-2">
                {user?.email}
              </p>
              <p className="text-sm font-medium leading-none peer-[all-&]:-mb-2">
                Joined on January 1, 2022
              </p>
            </div>
          </div>
          <div>
            <div>
              <Button className="hidden">Open modal</Button>
            </div>
            <div>
              <div>
                <div>Update your profile information.</div>
              </div>
              <div>
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage alt="" src={user?.image ?? ""} />
                    <AvatarFallback></AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                    <div>Your name will be displayed on your profile.</div>
                  </div>
                </div>
              </div>
              <div className="text-end">
                <Button variant="outline">Reset</Button>
                <Button variant="default" className="m-4" type="submit">
                  Save
                </Button>
              </div>
            </div>
          </div>
        </form>
      )}
    </Card>
  );
}

function FileEditIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 13.5V4a2 2 0 0 1 2-2h8.5L20 7.5V20a2 2 0 0 1-2 2h-5.5" />
      <polyline points="14 2 14 8 20 8" />
      <path d="M10.42 12.61a2.1 2.1 0 1 1 2.97 2.97L7.95 21 4 22l.99-3.95 5.43-5.44Z" />
    </svg>
  );
}
