import { createClient} from '../utils/supabase/client'

const supabase =createClient()
const bucket=supabase.storage.from('files')

const uploadFile=async (file) =>{
    const fileName=Date.now()+'-'+file.name;
    const filePath=await bucket.upload(fileName,file);
    const fileUrl=bucket.getPublicUrl(filePath.data.path);
    // Get file type (MIME type)
    const file_type = file.type || null;
    return {file_path :filePath.data.path,file_url:fileUrl.data.publicUrl, file_type};
}

// Update existing file in storage
const updateFileInStorage = async (file, existingFilePath) => {
    // Remove the old file first
    if (existingFilePath) {
        await bucket.remove([existingFilePath]);
    }
    // Upload the new file
    const fileName = Date.now() + '-' + file.name;
    const filePath = await bucket.upload(fileName, file);
    const fileUrl = bucket.getPublicUrl(filePath.data.path);
    const file_type = file.type || null;
    return {file_path: filePath.data.path, file_url: fileUrl.data.publicUrl, file_type};
}

export const addDocAPI = async (val) =>{
    const res=await supabase.auth.getUser(0);
    const {file_path,file_url,file_type}=await uploadFile(val.file);

    await supabase.from('doc').insert({
        title: val.title,
        file_url,
        file_path,
        file_type, // Store file_type
        uid:res.data.user.id
    })
}

export const updateDocAPI = async (val, docId) => {
    const res = await supabase.auth.getUser();
    
    let updateData = {
        title: val.title,
        uid: res.data.user.id
    };

    // If a new file is uploaded, update the file in storage
    if (val.file && val.file instanceof File) {
        // Get the existing document to get the old file path
        const { data: existingDoc } = await supabase
            .from('doc')
            .select('file_path')
            .eq('id', docId)
            .eq('uid', res.data.user.id)
            .single();

        if (existingDoc) {
            const { file_path, file_url, file_type } = await updateFileInStorage(val.file, existingDoc.file_path);
            updateData = {
                ...updateData,
                file_path,
                file_url,
                file_type
            };
        }
    }

    // Update the document
    const { error } = await supabase
        .from('doc')
        .update(updateData)
        .eq('id', docId)
        .eq('uid', res.data.user.id);

    if (error) {
        throw error;
    }
}

export const getDocsAPI = async (uid) =>{
    const res=await supabase
    .from('doc')
    .select('*')
    .eq('uid',uid)
    .order("created_at", { ascending: false });
    return res.data;
}

export const deleteDocAPI = async (item) =>{
    const res=await supabase.auth.getUser();
    await bucket.remove([item.file_path])
    await supabase.from('doc').delete().eq('id',item.id).eq('uid',res.data.user.id)
}

// export const getDocAPI=async (id) =>{
//     await supabase.from('doc').select('*').eq('id',id).single();
// }
export const getDocAPI = async (id) => {
    const { data, error } = await supabase.from("doc").select("*").eq("id", id).single();
    if (error) {
      console.error("Error fetching document:", error);
      return null;
    }
    return data;
  };
  