-- ==============================================================================
-- MR SAQIB 242 - SUPABASE GALLERY DATABASE QUERY (36 IMAGES)
-- Run this in Supabase -> SQL Editor -> Click 'Run' (Ctrl + Enter)
-- ==============================================================================

-- 1. Purge all existing/old gallery photos
DELETE FROM public.gallery;

-- 2. Insert the 36 new verified images into public.gallery
INSERT INTO public.gallery (title, image_url, category, display_order, is_active)
VALUES
  ('Visual Photo 1', 'https://ik.imagekit.io/mrsaqib/mrsaqib242-img1_yPzIc8MWvY.png', 'Portrait', 1, true),
  ('Visual Photo 2', 'https://ik.imagekit.io/mrsaqib/mrsaqib242-img2_qZL3jHY-8w.png', 'Visual', 2, true),
  ('Visual Photo 3', 'https://ik.imagekit.io/mrsaqib/mrsaqib242-img3_1O2fIqT4c.png', 'Visual', 3, true),
  ('Visual Photo 4', 'https://ik.imagekit.io/mrsaqib/mrsaqib242-img4_PMS638wr1.png', 'Visual', 4, true),
  ('Visual Photo 5', 'https://ik.imagekit.io/mrsaqib/mrsaqib242-img5_IARrsqYpU.png', 'Visual', 5, true),
  ('Visual Photo 6', 'https://ik.imagekit.io/mrsaqib/mrsaqib242-img6_5XmyEc4EA.png', 'Visual', 6, true),
  ('Visual Photo 7', 'https://ik.imagekit.io/mrsaqib/mrsaqib242-img7_5M4FC_xiu.png', 'Visual', 7, true),
  ('Visual Photo 8', 'https://ik.imagekit.io/mrsaqib/mrsaqib242-img8_WMaaHPsFlU.png', 'Visual', 8, true),
  ('Visual Photo 9', 'https://ik.imagekit.io/mrsaqib/mrsaqib242-img9_p-ieGDD5i.png', 'Visual', 9, true),
  ('Visual Photo 10', 'https://ik.imagekit.io/mrsaqib/mrsaqib242-img10_qFANBYRlk.png', 'Visual', 10, true),
  ('Visual Photo 11', 'https://ik.imagekit.io/mrsaqib/mrsaqib242-img11_UP-T_5u1n.png', 'Visual', 11, true),
  ('Visual Photo 12', 'https://ik.imagekit.io/mrsaqib/mrsaqib242-img12_jnTlZwOE-.png', 'Visual', 12, true),
  ('Visual Photo 13', 'https://ik.imagekit.io/mrsaqib/mrsaqib242-img13_XhJhYKDvf.png', 'Portrait', 13, true),
  ('Visual Photo 14', 'https://ik.imagekit.io/mrsaqib/mrsaqib242-img14_r0jgG6KZX.png', 'Visual', 14, true),
  ('Visual Photo 15', 'https://ik.imagekit.io/mrsaqib/mrsaqib242-img15_c2U4Krm8U.png', 'Visual', 15, true),
  ('Visual Photo 16', 'https://ik.imagekit.io/mrsaqib/mrsaqib242-img16_0_OLSVYNQ.png', 'Visual', 16, true),
  ('Visual Photo 17', 'https://ik.imagekit.io/mrsaqib/mrsaqib242-img17_XTDDmmlEr.png', 'Visual', 17, true),
  ('Visual Photo 18', 'https://ik.imagekit.io/mrsaqib/mrsaqib242-img18_z7ztIJcrSd.png', 'Visual', 18, true),
  ('Visual Photo 19', 'https://ik.imagekit.io/mrsaqib/mrsaqib242-img19_hfTx-fnDd.png', 'Visual', 19, true),
  ('Visual Photo 20', 'https://ik.imagekit.io/mrsaqib/mrsaqib242-img20_NPfkswOJo.png', 'Visual', 20, true),
  ('Visual Photo 21', 'https://ik.imagekit.io/mrsaqib/mrsaqib242-img21_uVmQwGGeVd.png', 'Visual', 21, true),
  ('Visual Photo 22', 'https://ik.imagekit.io/mrsaqib/mrsaqib242-img22_zSnClKpb1.png', 'Visual', 22, true),
  ('Visual Photo 23', 'https://ik.imagekit.io/mrsaqib/mrsaqib242-img23_U_zwxDWucs.png', 'Visual', 23, true),
  ('Visual Photo 24', 'https://ik.imagekit.io/mrsaqib/mrsaqib242-img24_lzMFBE7QO.png', 'Visual', 24, true),
  ('Visual Photo 25', 'https://ik.imagekit.io/mrsaqib/mrsaqib242-img25_7oG52NZUY.png', 'Visual', 25, true),
  ('Visual Photo 26', 'https://ik.imagekit.io/mrsaqib/mrsaqib242-img26_k5vxqkmX1c.png', 'Visual', 26, true),
  ('Visual Photo 27', 'https://ik.imagekit.io/mrsaqib/mrsaqib242-img27_YXu4foJMQt.png', 'Visual', 27, true),
  ('Visual Photo 28', 'https://ik.imagekit.io/mrsaqib/mrsaqib242-img28_mkWwai6dW.png', 'Visual', 28, true),
  ('Visual Photo 29', 'https://ik.imagekit.io/mrsaqib/mrsaqib242-img29_ZVARHwroy.png', 'Visual', 29, true),
  ('Visual Photo 30', 'https://ik.imagekit.io/mrsaqib/mrsaqib242-img30_RBsvjvj3Hx.png', 'Visual', 30, true),
  ('Visual Photo 31', 'https://ik.imagekit.io/mrsaqib/mrsaqib242-img31_pvVLIXYLr.png', 'Visual', 31, true),
  ('Visual Photo 32', 'https://ik.imagekit.io/mrsaqib/mrsaqib242-img32_KanjA3Hcr.png', 'Visual', 32, true),
  ('Visual Photo 33', 'https://ik.imagekit.io/mrsaqib/mrsaqib242-img33_rI8KX4XVg.png', 'Visual', 33, true),
  ('Visual Photo 34', 'https://ik.imagekit.io/mrsaqib/mrsaqib242-img34_ZZAg9iDeVt.png', 'Visual', 34, true),
  ('Visual Photo 35', 'https://ik.imagekit.io/mrsaqib/mrsaqib242-img35_O6rwICcsLl.png', 'Visual', 35, true),
  ('Visual Photo 36', 'https://ik.imagekit.io/mrsaqib/mrsaqib242-img36_sUUIWJnqw.png', 'Visual', 36, true);
