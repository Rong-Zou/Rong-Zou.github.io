---
layout: default
title: 3D Object Detection
description: A 3D Object Detector for detecting vehicles in autonomous driving scenes #Multimodal Data Fusion, Multi-task Learning and 
img: assets/img/box_refine.png
importance: 1
category: Computer Vision 
---

<h2 align="center">
  <b>Enhanced Box Refinement for 3D Object Detection</b>
</h2>
<!-- <div class="column is-full_width">
  <h4 align="center">
    <b>Rong Zou</b>,
    Matthew Hanlon
  </h4>
</div> -->


<div align="center" class="publication-links">
  <!-- PDF Link. -->
  <span class="link-block">
    <a href="box_refine.pdf" target="_blank"
        class="button is-normal is-rounded is-dark">
      <span class="icon">
          <i class="fas fa-file-pdf"></i>
      </span>
      <span>Report</span>
    </a>&nbsp;&nbsp;
  </span>


  <!-- Supp Link. -->
  <!-- <span class="link-block">
    <a href="xxx" target="_blank"
        class="button is-normal is-rounded is-dark">
      <span class="icon">
          <i class="fas fa-file-pdf"></i>
      </span>
      <span>Supplementary Material</span>
    </a>
  </span> -->

  
  <!-- Video Link. -->
  <!-- <span class="link-block">
    <a href="https://www.youtube.com/watch?v=9q059CFGcVA"
        class="external-link button is-normal is-rounded is-dark">
      <span class="icon">
          <i class="fab fa-youtube"></i>
      </span>
      <span>Video</span>
    </a>
  </span> -->


  <!-- Code Link. -->
  <!-- <span class="link-block">
    <a href="https://github.com/pengsongyou/openscene" target="_blank" class="external-link button is-normal is-rounded is-dark" style="background-color: #808080">
      <span class="icon">
          <i class="fab fa-github"></i>
      </span>
      <span >Code</span>
      </a>
  </span> -->
  
</div> 


<br>


<img src="baseline.jpg" width="100%" class="center" />
<div class="caption">
    <h6><b>Prediction from the baseline model</b></h6>
</div>

<img src="box_refine.png" width="100%" class="center" id="improved_pred"/>
<div class="caption">
    <h6><b>Prediction of the same scene from the improved model, confidence scores improve significantly</b></h6>
</div>

<hr>

<h3 align="center" class="subtitle has-text-centered">
  <b>Abstract / Description</b>
</h3>

<p style="text-align:justify; padding-top:10px">
In this project, a 2-stage 3D object detector is constructed to detect vehicles in autonomous driving scenes from irregular 3D point cloud. 
The first stage (Region Proposal Network (RPN)) is used to create coarse detection results from the point cloud. These initial detections are later refined at the second stage (Box Refinement Network (BRN)). In this project, we use a pretrained RPN and primarily focus on the BRN. 
</p>
<hr>

<h3 align="center" class="subtitle has-text-centered">
  <b>Project Details</b>
</h3>

<p style="text-align:justify; padding-top:10px">
We first pool the extracted features according to the initial predictions obtained from the first stage RPN to generate regions-of-interests (ROIs), i.e. smaller pools of information at and around likely objects. 
</p>
<p style="text-align:justify; padding-top:10px">
After that, we assign each ROI a ground truth bounding box, and classify each of them as foreground sample, easy background sample or hard background sample. During training, we feed different classes of samples into the network as evenly as possible. This is to make the BRN to predict an accurate confidence score for each of the ROI. The training of BRN is supervised via smoothL1 loss over the box parameters and BCE loss over the foreground/background categories. 
</p>
<p style="text-align:justify; padding-top:10px">
For each ROI, the network will output a bounding box and a confident score indicating its confidence that this box contains a vehicle. Since there are multiple ROIs sent into the model for each scene, we perform Non-Maximum Suppression to reduce the number of predictions during evaluation. The resulting predictions from our network are evaluated on three ground truth bounding box difficulty levels: easy, moderate, hard (determined based on distance, truncation and occlusion).
</p>
<p style="text-align:justify; padding-top:10px">
With the above BRN as the baseline model, we presented two methods for addressing the shortcomings and improving the performance of the baseline network, namely, canonical transformation
for the model to predict distant objects more accurately, and data augmentation for it to not overfit the training data. We also studied their respective effects on the baseline network
and the effect when they are combined. 
</p>
<hr>

<h3 align="center" class="subtitle has-text-centered">
  <b>Results / Conclusion</b>
</h3>


<ul>
  
  <li> 
    <p style="text-align:justify; padding-top:10px">
      We present in the following <a href="#results_table">table</a> that, by applying the above-mentioned modules, compared to the baseline model, the mAP metrics improve remarkably by 17.24%, 18.08% and 23.91% on the validation sets of three different difficulty levels, respectively.
    </p>
  </li>

  <li> 
    <p style="text-align:justify; padding-top:10px">
      From the same <a href="#results_table">table</a> we also show that the separate application of both modules can achieve significant improvements over the baseline model, while the data augmentation module becomes redundant when canonical transformation is performed in the network.
    </p>
  </li>

  <li> 
    <p style="text-align:justify; padding-top:10px">
      We find that by utilizing canonical transformation in the model, the increased performance can be achieved with a considerably reduced training time, meaning that it leads to much faster convergence, as seen from the training curves in the <a href="#results_curve">figure</a> below.
    </p>
  </li>

  <li> 
    <p style="text-align:justify; padding-top:10px">
      On the other hand, the canonical transformation can cause the model to produce false predictions near the boundary of the point cloud (see in the <a href="#improved_pred">results figure</a>), but adjusting parameters and hyperparameters related to the depth feature of the points may alleviate this adverse effect.
    </p>
  </li>

</ul>

<div align="center">  
  <img src="results_table.jpg" width="80%" class="center" id="results_table"/>
</div>
<div class="caption">
    <h6><b>Comparison of performance on the validation set for different networks</b></h6>
</div>

<div align="center"> 
  <img src="results_curve.jpg" width="90%" class="center" id="results_curve"/>
</div>

<div class="caption">
    <h6><b>Comparison of convergence speed for different networks</b></h6>
</div>



