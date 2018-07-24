package com.example.madhav.bms_yoga.HomePage;
import android.content.Context;
import android.support.v7.widget.RecyclerView;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;


import com.example.madhav.bms_yoga.R;

import java.util.ArrayList;



/**
 * Created by User on 2/12/2018.
 */

public class RecyclerViewAdapter extends RecyclerView.Adapter<RecyclerViewAdapter.ViewHolder> {
    ImageView imgView_g;
    ImageView imgView_r;
    ImageView imgView_grey_d;
    ImageView imgView_grey_u;
    private static final String TAG = "RecyclerViewAdapter";

    //vars
    private ArrayList<String> mNames = new ArrayList<>();
    private ArrayList<String> mClassCount = new ArrayList<>();

    // private ArrayList<String> mImageUrls = new ArrayList<>();
    private Context mContext;

    public RecyclerViewAdapter(ArrayList<String> names,ArrayList<String> classcount) {
        mNames = names;
        mClassCount = classcount;

        //mImageUrls = imageUrls;
        // mContext = context;
    }

    @Override
    public ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.layout_listitems, parent, false);
        imgView_g = view.findViewById(R.id.green_id);
        imgView_r = view.findViewById(R.id.red_id);
        imgView_grey_d = view.findViewById(R.id.greyd_id);
        imgView_grey_u = view.findViewById(R.id.greyu_id);

        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(ViewHolder holder, final int position) {
        Log.d(TAG, "onBindViewHolder: called.");

        /*Glide.with(mContext)
                .asBitmap()
                .load(mImageUrls.get(position))
                .into(holder.image);*/

        holder.name.setText(mNames.get(position));
        holder.classC.setText(mClassCount.get(position));

        //Log.d("test", mClassCount.get(position));
        if(mClassCount.get(position) == "12")
        {
            imgView_g.setVisibility(View.VISIBLE);
            imgView_grey_d.setVisibility(View.VISIBLE);
        }

        if(mClassCount.get(position) == "03")
        {
            imgView_r.setVisibility(View.VISIBLE);
            imgView_grey_u.setVisibility(View.VISIBLE);
            //imgView_gre.setVisibility(View.VISIBLE);
        }
        /*holder.image.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Log.d(TAG, "onClick: clicked on an image: " + mNames.get(position));
                Toast.makeText(mContext, mNames.get(position), Toast.LENGTH_SHORT).show();
            }
        });*/
    }

    @Override
    public int getItemCount() {
        return mNames.size();
    }

    public class ViewHolder extends RecyclerView.ViewHolder{

        // ImageView image;
        TextView name;
        TextView classC;

        public ViewHolder(View itemView) {
            super(itemView);
            //image = itemView.findViewById(R.id.image_view);
            name = itemView.findViewById(R.id.title);
          classC = itemView.findViewById(R.id.classcount);

        }

    }
}
