import { createClient} from '../utils/supabase/client'

const supabase =createClient()
const bucket=supabase.storage.from('files')

const uploadFile=async (file) =>{
    const fileName=Date.now()+'-'+file.name;
    const filePath=await bucket.upload(fileName,file);
    const fileUrl=bucket.getPublicUrl(filePath.data.path);

    return {file_path :filePath.data.path,file_url:fileUrl.data.publicUrl}
}

export const addDocAPI = async (val) =>{
    const res=await supabase.auth.getUser(0);
    const {file_path,file_url}=await uploadFile(val.file);

    await supabase.from('doc').insert({
        title: val.title,
        file_url,
        file_path,
        uid:res.data.user.id
    })
}

export const getDocsAPI = async (uid) =>{
    const res=await supabase
    .from('doc')
    .select('*')
    .eq('uid',uid)
    .order("created_at", { ascending: false });
    return res.data;
}