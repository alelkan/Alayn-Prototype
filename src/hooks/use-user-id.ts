"use client";

import { useEffect, useState } from "react";

export const useUserId = () => {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getOrCreateUserId = () => {
      let id = localStorage.getItem("alayn_user_id");
      if (!id) {
        id = crypto.randomUUID();
        localStorage.setItem("alayn_user_id", id);
      }
      return id;
    };

    const id = getOrCreateUserId();
    setUserId(id);
  }, []);

  return userId;
};